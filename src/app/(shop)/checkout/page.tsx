"use client";

import React, { useState, useEffect } from "react";
import { PhoneIcon, MapPinIcon, CreditCardIcon } from "@heroicons/react/24/outline";
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from "@/context/auth-context";
import { doc, getDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase-config';
import { toast } from 'react-hot-toast';
import { Address } from '@/core/entities/address';
import { Order, OrderItem } from "@/core/entities/order";
import { User } from "@/core/entities/user";

interface CheckoutFormData {
  name: string;
  phoneNumber: string;
  province: string;
  city: string;
  district: string;
  postalCode: string;
  fullAddress: string;
  notes?: string;
}

export default function Checkout() {
  const router = useRouter();
  const { cart, user, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [shippingConfirmed, setShippingConfirmed] = useState(false);
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    phoneNumber: '',
    province: '',
    city: '',
    district: '',
    postalCode: '',
    fullAddress: '',
    notes: ''
  });

  const subtotal = cart.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
  const totalAmount = subtotal;

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/checkout');
      return;
    }

    fetchUserData();
    fetchUserAddresses();
  }, [user, cart, router]);

  const fetchUserData = async () => {
    if (!user?.uid) return;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        setUserData(userData);
        
        setFormData(prev => ({
          ...prev,
          name: userData.name || '',
          phoneNumber: userData.phoneNumber || ''
        }));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchUserAddresses = async () => {
    if (!user?.uid) return;
    
    try {
      const addressesQuery = query(
        collection(db, 'addresses'),
        where('userId', '==', user.uid)
      );
      const addressesSnapshot = await getDocs(addressesQuery);
      
      const userAddresses = addressesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Address[];
      
      setAddresses(userAddresses);
      
      const defaultAddress = userAddresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
        fillFormWithAddress(defaultAddress);
      } else if (userAddresses.length > 0) {
        setSelectedAddressId(userAddresses[0].id);
        fillFormWithAddress(userAddresses[0]);
      } else {
        setUseNewAddress(true);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fillFormWithAddress = (address: Address) => {
    setFormData(prev => ({
      ...prev,
      province: address.province,
      city: address.city,
      district: address.district,
      postalCode: address.postalCode,
      fullAddress: address.fullAddress,
      notes: address.notes || ''
    }));
  };

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    setUseNewAddress(false);
    
    const selectedAddress = addresses.find(addr => addr.id === addressId);
    if (selectedAddress) {
      fillFormWithAddress(selectedAddress);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateOrderNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  };

  const handleSubmitOrder = async () => {
    if (!user?.uid) {
      toast.error('Please login to continue');
      return;
    }

    if (!shippingConfirmed) {
      toast.error('Harap konfirmasi ongkir terlebih dahulu');
      return;
    }

    if (!formData.name.trim() || !formData.phoneNumber.trim()) {
      toast.error('Please fill in contact information');
      return;
    }

    if (!formData.province.trim() || !formData.city.trim() || !formData.district.trim() || !formData.fullAddress.trim()) {
      toast.error('Please fill in shipping address');
      return;
    }

    setIsSubmitting(true);

    try {
      const shippingAddress: Address = {
        id: useNewAddress ? '' : selectedAddressId,
        userId: user.uid,
        recipientName: formData.name,
        phoneNumber: formData.phoneNumber,
        province: formData.province,
        city: formData.city,
        district: formData.district,
        postalCode: formData.postalCode || '',
        fullAddress: formData.fullAddress,
        isDefault: false,
        notes: formData.notes || '', 
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const orderItems: OrderItem[] = cart.map((cartItem: any) => ({
        productId: cartItem.productId,
        productName: cartItem.name,
        productImage: cartItem.image || '', 
        variantId: cartItem.variantId || '', 
        size: cartItem.variantDetails?.split(', ')[1] || '', 
        color: cartItem.variantDetails?.split(', ')[0] || '', 
        quantity: cartItem.quantity,
        price: cartItem.price,
        subtotal: cartItem.price * cartItem.quantity
      }));

      const order: Omit<Order, 'id'> = {
        userId: user.uid,
        orderNumber: generateOrderNumber(),
        shippingAddress,
        subtotal,
        totalAmount,
        status: 'pending',
        items: orderItems,
        paymentStatus: 'unpaid',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const orderToSave = {
        ...order,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      console.log('Order to save:', orderToSave);

      const orderRef = await addDoc(collection(db, 'orders'), orderToSave);

      await clearCart();

      toast.success('Order created successfully!');
      
      router.push(`/paymentconfirmation/${orderRef.id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 bg-blue-200 rounded-full mb-2"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!user || cart.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white p-6 flex justify-center">
      <div className="w-full max-w-screen-xl">
        <h1 className="text-3xl font-bold text-black mt-6 mb-6">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Side - Form */}
          <div className="space-y-8">
            {/* Info Kontak */}
            <div className="border-2 rounded-xl p-6">
              <div className="flex items-center mb-2">
                <PhoneIcon className="w-5 h-5 text-black mr-2" />
                <h2 className="font-regular text-lg text-black">INFO KONTAK</h2>
              </div>
              <hr className="w-full block border-black mb-4" />
              <div className="space-y-4">
                <div>
                  <label className="block text-[15px] font-bold mb-1 text-black">Nama Lengkap</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Masukkan Nama Lengkap" 
                    className="w-full h-[45px] text-[15px] px-4 p-2 border-2 rounded-md" 
                  />
                </div>
                <div>
                  <label className="block text-[15px] font-bold mb-1 text-black">Nomor Telepon</label>
                  <input 
                    type="text" 
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Masukkan Nomor Telepon" 
                    className="w-full h-[45px] text-[15px] px-4 p-2 border-2 rounded-md" 
                  />
                </div>
              </div>
            </div>

            {/* Saved Addresses */}
            {addresses.length > 0 && (
              <div className="border-2 rounded-xl p-6">
                <h2 className="font-regular text-lg text-black mb-4">ALAMAT TERSIMPAN</h2>
                <div className="space-y-3 mb-4">
                  {addresses.map((address) => (
                    <div key={address.id} className="border rounded-md p-3">
                      <div className="flex items-center mb-2">
                        <input
                          type="radio"
                          id={`address-${address.id}`}
                          name="selectedAddress"
                          checked={selectedAddressId === address.id && !useNewAddress}
                          onChange={() => handleAddressSelect(address.id)}
                          className="mr-2"
                        />
                        <label htmlFor={`address-${address.id}`} className="font-medium text-black">
                          {address.recipientName}
                          {address.isDefault && <span className="ml-2 text-xs bg-yellow-400 text-black px-2 py-1 rounded">Default</span>}
                        </label>
                      </div>
                      <p className="text-sm text-gray-600 ml-6">
                        {address.fullAddress}, {address.district}, {address.city}, {address.province} {address.postalCode}
                      </p>
                      <p className="text-sm text-gray-600 ml-6">{address.phoneNumber}</p>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setUseNewAddress(!useNewAddress)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  {useNewAddress ? 'Gunakan alamat tersimpan' : 'Gunakan alamat baru'}
                </button>
              </div>
            )}

            {/* Alamat Pengiriman */}
            {(useNewAddress || addresses.length === 0) && (
              <div className="border-2 rounded-xl p-6">
                <div className="flex items-center mb-2">
                  <MapPinIcon className="w-5 h-5 text-black mr-2" />
                  <h2 className="font-regular text-lg text-black">ALAMAT PENGIRIMAN</h2>
                </div>
                <hr className="w-full block border-black mb-4" />
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[15px] font-bold mb-1 text-black">Provinsi</label>
                    <input 
                      type="text" 
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      placeholder="Masukkan Provinsi" 
                      className="w-full h-[45px] text-[15px] px-4 p-2 border-2 rounded-md" 
                    />
                  </div>
                  <div>
                    <label className="block text-[15px] font-bold mb-1 text-black">Kota</label>
                    <input 
                      type="text" 
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Masukkan Kota" 
                      className="w-full h-[45px] text-[15px] px-4 p-2 border-2 rounded-md" 
                    />
                  </div>
                  <div>
                    <label className="block text-[15px] font-bold mb-1 text-black">Kecamatan</label>
                    <input 
                      type="text" 
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      placeholder="Masukkan Kecamatan" 
                      className="w-full h-[45px] text-[15px] px-4 p-2 border-2 rounded-md" 
                    />
                  </div>
                  <div>
                    <label className="block text-[15px] font-bold mb-1 text-black">Kode Pos</label>
                    <input 
                      type="text" 
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="Masukkan Kode Pos" 
                      className="w-full h-[45px] text-[15px] px-4 p-2 border-2 rounded-md" 
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-[15px] font-bold mb-1 text-black">Alamat Lengkap</label>
                  <textarea
                    name="fullAddress"
                    value={formData.fullAddress}
                    onChange={handleInputChange}
                    placeholder="Masukkan alamat lengkap (nama jalan, nomor rumah, RT/RW, dll)"
                    rows={3}
                    className="w-full text-[15px] px-4 p-2 border-2 rounded-md resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[15px] font-bold mb-1 text-black">Catatan (Opsional)</label>
                  <input 
                    type="text" 
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Contoh: kasi banyak bubble wrapnya kak" 
                    className="w-full h-[45px] text-[15px] px-4 p-2 border-2 rounded-md" 
                  />
                </div>
              </div>
            )}

            {/* Metode Pembayaran */}
            <div className="border-2 rounded-xl p-6">
              <div className="flex items-center mb-2">
                <CreditCardIcon className="w-5 h-5 text-black mr-2" />
                <h2 className="font-regular text-lg text-black">METODE PEMBAYARAN</h2>
              </div>
              <hr className="w-full block border-black mb-4" />
              <div className="border-2 p-4 rounded-md bg-gray-50">
                <p className="italic text-sm mb-2 text-black">Transfer menggunakan rekening a/n Faizah Nawawi.</p>
                <img src="/assets/bni.png" alt="BNI Logo" className="w-20" />
                <p className="text-xs text-gray-600 mt-2">
                  Instruksi pembayaran akan dikirim setelah konfirmasi order.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div>
            <h2 className="text-xl font-semibold text-black mb-2">Ringkasan Pesanan</h2>
            <hr className="mb-6 border-black" />
            <div className="space-y-6">
              {/* Cart Items */}
              {cart.map((item: any) => (
                <div key={`${item.productId}-${item.variantId || 'no-variant'}`} className="flex justify-between border-b pb-4">
                  <div className="flex gap-4">
                    <img src={item.image || "/assets/placeholder.png"} alt={item.name} className="w-28 h-28 object-cover rounded-md" />
                    <div>
                      <h3 className="font-bold text-[15px] text-black">{item.name}</h3>
                      {item.variantDetails && (
                        <p className="text-sm text-gray-600">{item.variantDetails}</p>
                      )}
                      <p className="text-sm text-black">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-600">@Rp{item.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-black">Rp{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}

              {/* Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-black">
                  <p className="text-gray-600">Subtotal ({cart.reduce((sum: number, item: any) => sum + item.quantity, 0)} items)</p>
                  <p>Rp{subtotal.toLocaleString()}</p>
                </div>
                
                <hr className="border-gray-300" />
                <div className="flex justify-between font-bold text-lg text-black mb-4">
                  <p>Total</p>
                  <p>Rp{totalAmount.toLocaleString()}</p>
                </div>

                {/* Shipping Confirmation Checkbox */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="shippingConfirmation"
                      checked={shippingConfirmed}
                      onChange={(e) => setShippingConfirmed(e.target.checked)}
                      className="mt-1 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                    />
                    <label htmlFor="shippingConfirmation" className="text-sm text-gray-700 leading-5">
                      <span className="font-medium">Saya telah mengecek ongkir dari admin atau menerima berapapun ongkirnya</span>
                      <p className="text-xs text-gray-500 mt-1">
                        Centang kotak ini untuk konfirmasi bahwa Anda telah menanyakan ongkir kepada admin atau siap menerima biaya ongkir yang akan dikenakan.
                      </p>
                    </label>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmitOrder}
                disabled={isSubmitting || !shippingConfirmed}
                className={`w-full h-[50px] bg-yellow-400 hover:bg-yellow-500 transition text-center py-3 rounded-2xl shadow-md text-white font-semibold ${
                  (isSubmitting || !shippingConfirmed) ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Memproses...' : 'Buat Pesanan'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}