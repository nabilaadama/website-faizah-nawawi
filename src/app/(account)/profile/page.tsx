'use client';

import React, { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase/firebase-config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut, updateEmail } from 'firebase/auth';

interface Address {
  id: string;
  recipientName: string;
  fullAddress: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
}

export default function ProfilePage() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
  });

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
    recipientName: '',
    fullAddress: '',
    district: '',
    city: '',
    province: '',
    postalCode: '',
    isDefault: false,
  });

  const [userId, setUserId] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData({
              name: data.name || '',
              email: user.email || '',
              phoneNumber: data.phoneNumber || '',
            });
            
            // Load addresses from Firestore
            setAddresses(data.addresses || []);
          } else {
            setUserData((prev) => ({ ...prev, email: user.email || '' }));
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
          setError('Gagal memuat data pengguna.');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setNewAddress((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const generateAddressId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const handleAddAddress = () => {
    if (!newAddress.recipientName || !newAddress.fullAddress || !newAddress.city) {
      setError('Mohon isi minimal Nama Penerima, Alamat Lengkap, dan Kota');
      return;
    }

    const addressToAdd: Address = {
      ...newAddress,
      id: editingAddressId || generateAddressId(),
    };

    if (editingAddressId) {
      // Edit existing address
      setAddresses(prev => prev.map(addr => 
        addr.id === editingAddressId ? addressToAdd : addr
      ));
      setEditingAddressId(null);
    } else {
      // Add new address
      if (newAddress.isDefault) {
        // Remove default from other addresses
        setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: false })));
      }
      setAddresses(prev => [...prev, addressToAdd]);
    }

    // Reset form
    setNewAddress({
      recipientName: '',
      fullAddress: '',
      district: '',
      city: '',
      province: '',
      postalCode: '',
      isDefault: false,
    });
    setShowAddAddressForm(false);
    setError(null);
  };

  const handleEditAddress = (address: Address) => {
    setNewAddress({
      recipientName: address.recipientName,
      fullAddress: address.fullAddress,
      district: address.district,
      city: address.city,
      province: address.province,
      postalCode: address.postalCode,
      isDefault: address.isDefault,
    });
    setEditingAddressId(address.id);
    setShowAddAddressForm(true);
  };

  const handleDeleteAddress = (addressId: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== addressId));
    setShowDeleteModal(null);
  };

  const handleSetDefaultAddress = (addressId: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    })));
  };

  const handleSaveChanges = async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const user = auth.currentUser;
      const docRef = doc(db, 'users', userId);

      // Update Firestore fields
      await updateDoc(docRef, {
        name: userData.name,
        phoneNumber: userData.phoneNumber,
        addresses: addresses,
      });

      // Update email in Firebase Auth if changed
      if (user && user.email !== userData.email) {
        await updateEmail(user, userData.email);
        await updateDoc(docRef, { email: userData.email });
      }

      setShowSuccessModal(true);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Gagal menyimpan perubahan.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
      setError('Gagal logout. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
      setShowLogoutModal(false);
    }
  };

  const cancelAddAddress = () => {
    setShowAddAddressForm(false);
    setEditingAddressId(null);
    setNewAddress({
      recipientName: '',
      fullAddress: '',
      district: '',
      city: '',
      province: '',
      postalCode: '',
      isDefault: false,
    });
    setError(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex flex-1 relative">
        <main className="flex-1 p-10">
          <div className="border-2 rounded-[16px] p-8 max-w-3xl mx-auto bg-white shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-black">Personal Information</h1>

            {/* Basic Info Fields */}
            <div className="mb-8">
              <label className="block text-[15px] font-bold mb-1 text-black">Full Name</label>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                placeholder="Enter Your Full Name"
                className="w-full h-[45px] text-[15px] px-4 p-2 border-2 rounded-md"
              />
            </div>

            <div className="mb-8">
              <label className="block text-[15px] font-bold mb-1 text-black">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={userData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter Your Phone Number"
                className="w-full h-[45px] text-[15px] px-4 p-2 border-2 rounded-md"
              />
            </div>

            {/* Addresses Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-black">Addresses</h2>
                <button
                  onClick={() => setShowAddAddressForm(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition text-sm"
                >
                  + Add Address
                </button>
              </div>

              {/* Display existing addresses */}
              {addresses.length > 0 ? (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div key={address.id} className="border-2 rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-black">{address.recipientName}</h3>
                          {address.isDefault && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditAddress(address)}
                            className="text-blue-500 hover:underline text-sm"
                          >
                            Edit
                          </button>
                          {!address.isDefault && (
                            <button
                              onClick={() => handleSetDefaultAddress(address.id)}
                              className="text-green-600 hover:underline text-sm"
                            >
                              Set Default
                            </button>
                          )}
                          <button
                            onClick={() => setShowDeleteModal(address.id)}
                            className="text-red-500 hover:underline text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm mb-1">{address.fullAddress}</p>
                      <p className="text-gray-600 text-sm">
                        {[address.district, address.city, address.province, address.postalCode]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">Belum ada alamat yang tersimpan</p>
              )}

              {/* Add/Edit Address Form */}
              {showAddAddressForm && (
                <div className="mt-4 p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
                  <h3 className="font-bold mb-4 text-black">
                    {editingAddressId ? 'Edit Address' : 'Add New Address'}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1 text-black">Recipient Name *</label>
                      <input
                        type="text"
                        name="recipientName"
                        value={newAddress.recipientName}
                        onChange={handleAddressInputChange}
                        placeholder="Enter recipient's full name"
                        className="w-full h-[40px] text-sm px-3 p-2 border rounded-md"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1 text-black">Full Address *</label>
                      <textarea
                        name="fullAddress"
                        value={newAddress.fullAddress}
                        onChange={handleAddressInputChange}
                        placeholder="Enter complete address"
                        className="w-full text-sm px-3 p-2 border rounded-md"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-black">District</label>
                      <input
                        type="text"
                        name="district"
                        value={newAddress.district}
                        onChange={handleAddressInputChange}
                        placeholder="District"
                        className="w-full h-[40px] text-sm px-3 p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-black">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={newAddress.city}
                        onChange={handleAddressInputChange}
                        placeholder="City"
                        className="w-full h-[40px] text-sm px-3 p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-black">Province</label>
                      <input
                        type="text"
                        name="province"
                        value={newAddress.province}
                        onChange={handleAddressInputChange}
                        placeholder="Province"
                        className="w-full h-[40px] text-sm px-3 p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-black">Postal Code</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={newAddress.postalCode}
                        onChange={handleAddressInputChange}
                        placeholder="Postal Code"
                        className="w-full h-[40px] text-sm px-3 p-2 border rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="isDefault"
                        checked={newAddress.isDefault}
                        onChange={handleAddressInputChange}
                        className="rounded"
                      />
                      <span className="text-sm text-black">Set as default address</span>
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleAddAddress}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition text-sm"
                    >
                      {editingAddressId ? 'Update Address' : 'Add Address'}
                    </button>
                    <button
                      onClick={cancelAddAddress}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Login Details */}
            <h2 className="text-2xl font-bold mb-6 text-black">Login Details</h2>
            <div className="mb-8">
              <label className="block text-[15px] font-bold mb-1 text-black">Email</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                placeholder="Enter Your Email"
                className="w-full h-[45px] text-[15px] px-4 p-2 border-2 rounded-md"
              />
            </div>

            <div className="mb-10">
              <label className="block text-[15px] font-bold mb-1 text-black">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter Your New Password"
                  className="w-full h-[45px] text-[15px] px-4 p-2 border-2 rounded-md"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-blue-500 hover:underline"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}

            <div className="flex flex-col gap-4">
              <button
                onClick={handleSaveChanges}
                disabled={isLoading}
                className="h-[45px] bg-yellow-400 text-white py-3 rounded-[18px] font-semibold hover:bg-yellow-500 shadow-md transition"
              >
                {isLoading ? 'Menyimpan...' : 'Save Changes'}
              </button>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="h-[45px] bg-yellow-400 text-white py-3 rounded-[18px] font-semibold hover:bg-yellow-500 shadow-md transition"
              >
                Log me out
              </button>
              <button className="h-[45px] bg-yellow-400 text-white py-3 rounded-[18px] font-semibold hover:bg-yellow-500 shadow-md transition">
                Delete Account
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-bold mb-2 text-black">Berhasil!</h2>
            <p className="text-sm mb-6 text-gray-700">Perubahan berhasil disimpan.</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="px-6 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8 flex flex-col items-center justify-center text-center">
            <h2 className="text-lg font-bold mb-4 text-black">Konfirmasi Logout</h2>
            <p className="text-sm mb-6 text-gray-700">Apakah Anda yakin ingin logout dari akun ini?</p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                {isLoading ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Address Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8 flex flex-col items-center justify-center text-center">
            <h2 className="text-lg font-bold mb-4 text-black">Konfirmasi Hapus</h2>
            <p className="text-sm mb-6 text-gray-700">Apakah Anda yakin ingin menghapus alamat ini?</p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Batal
              </button>
              <button
                onClick={() => handleDeleteAddress(showDeleteModal)}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}