"use client";

import React, { useState, useEffect, useCallback } from "react";
import { PhoneIcon, MapPinIcon, CreditCardIcon } from "@heroicons/react/24/outline";
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from "@/context/auth-context";
import { doc, getDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase-config';
import { toast } from 'react-hot-toast';
import { Address } from '@/core/entities/address';
import { BankAccount } from '@/core/entities/bank-account';
import { Order, OrderItem } from "@/core/entities/order";
import { User } from "@/core/entities/user";
import Image from 'next/image';

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
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [shippingConfirmed, setShippingConfirmed] = useState(false);
  const [imageError, setImageError] = useState(false);
  
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

  const initializeData = useCallback(async () => {
    try {
      await Promise.all([
        fetchUserData(),
        fetchDefaultAddress(),
        fetchBankAccounts()
      ]);
    } catch (error) {
      console.error('Error initializing data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]); 

  useEffect(() => {
  if (!user) {
    router.push('/login?redirect=/checkout');
    return;
  }

  initializeData();
}, [user, router, initializeData]);

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

  const fetchDefaultAddress = async () => {
    if (!user?.uid) return;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const addresses = userData.addresses || [];
        
        // Find the default address
        const defaultAddr = addresses.find((addr: any) => addr.isDefault === true);
        
        if (defaultAddr) {
          const address: Address = {
            id: defaultAddr.id,
            userId: user.uid,
            recipientName: defaultAddr.recipientName,
            phoneNumber: userData.phoneNumber || '', // Use user's phone if not in address
            province: defaultAddr.province,
            city: defaultAddr.city,
            district: defaultAddr.district,
            postalCode: defaultAddr.postalCode,
            fullAddress: defaultAddr.fullAddress,
            isDefault: defaultAddr.isDefault,
            notes: defaultAddr.notes || '',
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          setDefaultAddress(address);
          fillFormWithAddress(address);
        }
      }
    } catch (error) {
      console.error('Error fetching default address:', error);
    }
  };

  const fetchBankAccounts = async () => {
    try {
      const bankAccountsQuery = query(
        collection(db, 'bank-accounts'),
        where('isActive', '==', true)
      );
      const bankAccountsSnapshot = await getDocs(bankAccountsQuery);
      
      const activeBankAccounts = bankAccountsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as BankAccount[];
      
      setBankAccounts(activeBankAccounts);
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
      toast.error('Failed to load payment methods');
    }
  };

  const fillFormWithAddress = (address: Address) => {
    setFormData(prev => ({
      ...prev,
      name: address.recipientName,
      phoneNumber: address.phoneNumber || prev.phoneNumber, 
      province: address.province,
      city: address.city,
      district: address.district,
      postalCode: address.postalCode,
      fullAddress: address.fullAddress,
      notes: address.notes || ''
    }));
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
      toast.error('Please confirm shipping cost first');
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
        id: defaultAddress?.id || '',
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
            {/* Contact Information */}
            <div className="border-2 rounded-xl p-6">
              <div className="flex items-center mb-2">
                <PhoneIcon className="w-5 h-5 text-black mr-2" />
                <h2 className="font-regular text-lg text-black">CONTACT INFORMATION</h2>
              </div>
              <hr className="w-full block border-black mb-4" />
              <div className="space-y-4">
                <div>
                  <label className="block text-[15px] font-bold mb-1 text-black">Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter Full Name" 
                    className="w-full h-[45px] text-[15px] px-4 p-2 border-2 rounded-md" 
                  />
                </div>
                <div>
                  <label className="block text-[15px] font-bold mb-1 text-black">Phone Number</label>
                  <input 
                    type="text" 
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Enter Phone Number" 
                    className="w-full h-[45px] text-[15px] px-4 p-2 border-2 rounded-md" 
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address - Auto-filled from default address */}
            <div className="border-2 rounded-xl p-6">
              <div className="flex items-center mb-2">
                <MapPinIcon className="w-5 h-5 text-black mr-2" />
                <h2 className="font-regular text-lg text-black">SHIPPING ADDRESS</h2>
              </div>
              <hr className="w-full block border-black mb-4" />
              
              {defaultAddress ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[15px] font-bold mb-1 text-black">Province</label>
                      <input 
                        type="text" 
                        name="province"
                        value={formData.province}
                        readOnly
                        className="w-full h-[45px] text-[15px] px-4 p-2 border-2 rounded-md bg-gray-100" 
                      />
                    </div>
                    <div>
                      <label className="block text-[15px] font-bold mb-1 text-black">City</label>
                      <input 
                        type="text" 
                        name="city"
                        value={formData.city}
                        readOnly
                        className="w-full h-[45px] text-[15px] px-4 p-2 border-2 rounded-md bg-gray-100" 
                      />
                    </div>
                    <div>
                      <label className="block text-[15px] font-bold mb-1 text-black">District</label>
                      <input 
                        type="text" 
                        name="district"
                        value={formData.district}
                        readOnly
                        className="w-full h-[45px] text-[15px] px-4 p-2 border-2 rounded-md bg-gray-100" 
                      />
                    </div>
                    <div>
                      <label className="block text-[15px] font-bold mb-1 text-black">Postal Code</label>
                      <input 
                        type="text" 
                        name="postalCode"
                        value={formData.postalCode}
                        readOnly
                        className="w-full h-[45px] text-[15px] px-4 p-2 border-2 rounded-md bg-gray-100" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[15px] font-bold mb-1 text-black">Full Address</label>
                    <textarea
                      name="fullAddress"
                      value={formData.fullAddress}
                      readOnly
                      rows={3}
                      className="w-full text-[15px] px-4 p-2 border-2 rounded-md resize-none bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[15px] font-bold mb-1 text-black">Notes (Optional)</label>
                    <input 
                      type="text" 
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Example: please use extra bubble wrap" 
                      className="w-full h-[45px] text-[15px] px-4 p-2 border-2 rounded-md" 
                    />
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-700">
                      <span className="font-medium">Default Address:</span> This address is automatically selected from your default shipping address.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-700">
                    <span className="font-medium">No Default Address Found:</span> Please set a default address in your profile settings before proceeding with checkout.
                  </p>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="border-2 rounded-xl p-6">
              <div className="flex items-center mb-2">
                <CreditCardIcon className="w-5 h-5 text-black mr-2" />
                <h2 className="font-regular text-lg text-black">PAYMENT METHOD</h2>
              </div>
              <hr className="w-full block border-black mb-4" />
              
              {bankAccounts.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-3">
                    Bank transfer using the following account:
                  </p>
                  {bankAccounts.map((bankAccount) => (
                    <div key={bankAccount.id} className="border-2 p-4 rounded-md bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          {!imageError && (
                          <Image
                            src={`/assets/${bankAccount.bankName.toLowerCase()}.png`}
                            alt={bankAccount.bankName}
                            width={80}
                            height={60}
                            className="w-20 h-auto mr-3"
                            onError={() => {
                              setImageError(true);
                            }}
                          />
                        )}
                          <div>
                            <p className="font-semibold text-black">{bankAccount.bankName}</p>
                            <p className="text-sm text-gray-600">{bankAccount.accountNumber}</p>
                            <p className="text-sm text-gray-600">{bankAccount.accountHolder}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <p className="text-xs text-gray-600 mt-2">
                    Payment instructions will be sent after order confirmation.
                  </p>
                </div>
              ) : (
                <div className="border-2 p-4 rounded-md bg-gray-50">
                  <p className="text-sm text-gray-600">
                    Payment methods are currently unavailable. Please contact admin.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div>
            <h2 className="text-xl font-semibold text-black mb-2">Order Summary</h2>
            <hr className="mb-6 border-black" />
            <div className="space-y-6">
              {/* Cart Items */}
              {cart.map((item: any) => (
                <div key={`${item.productId}-${item.variantId || 'no-variant'}`} className="flex justify-between border-b pb-4">
                  <div className="flex gap-4">
                    <div className="relative w-28 h-28">
                      <Image 
                        src={item.image || "/assets/placeholder.png"} 
                        alt={item.name} 
                        fill
                        sizes="112px"
                        className="object-cover rounded-md" 
                      />
                    </div>
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
                      <span className="font-medium">I have checked the shipping cost with admin or accept any shipping charges</span>
                      <p className="text-xs text-gray-500 mt-1">
                        Check this box to confirm that you have asked the admin about shipping costs or are ready to accept the shipping charges that will be applied.
                      </p>
                    </label>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmitOrder}
                disabled={isSubmitting || !shippingConfirmed || !defaultAddress}
                className={`w-full h-[50px] bg-yellow-400 hover:bg-yellow-500 transition text-center py-3 rounded-2xl shadow-md text-white font-semibold ${
                  (isSubmitting || !shippingConfirmed || !defaultAddress) ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}