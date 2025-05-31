'use client';

import React, { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase/firebase-config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut, updateEmail } from 'firebase/auth';

export default function ProfilePage() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    district: '',
    city: '',
    province: '',
    postalCode: '',
  });

  const [userId, setUserId] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData({
              name: docSnap.data().name || '',
              email: user.email || '',
              phoneNumber: docSnap.data().phoneNumber || '',
              address: docSnap.data().address || '',
              district: docSnap.data().district || '',
              city: docSnap.data().city || '',
              province: docSnap.data().province || '',
              postalCode: docSnap.data().postalCode || '',
            });
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
        address: userData.address,
        district: userData.district,
        city: userData.city,
        province: userData.province,
        postalCode: userData.postalCode,
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

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex flex-1 relative">
        <main className="flex-1 p-10">
          <div className="border-2 rounded-[16px] p-8 max-w-3xl mx-auto bg-white shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-black">Informasi Personal</h1>

            {/* Form Fields */}
            <div className="mb-8">
              <label className="block text-[15px] font-bold mb-1 text-black">Nama Lengkap</label>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                placeholder="Masukkan Nama Lengkap"
                className="w-full h-[45px] text-[15px] px-4 p-2 border-2 rounded-md"
              />
            </div>

            <div className="mb-8">
              <label className="block text-[15px] font-bold mb-1 text-black">Nomor Telepon</label>
              <input
                type="tel"
                name="phoneNumber"
                value={userData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Masukkan Nomor Telepon"
                className="w-full h-[45px] text-[15px] px-4 p-2 border-2 rounded-md"
              />
            </div>

            <div className="mb-8">
              <label className="block text-[15px] font-bold mb-1 text-black">Alamat</label>
              <textarea
                name="address"
                value={userData.address}
                onChange={handleInputChange}
                placeholder="Masukkan Alamat"
                className="w-full text-[15px] px-4 p-2 border-2 rounded-md"
                rows={3}
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block text-[15px] font-bold mb-1 text-black">Kecamatan</label>
                <input
                  type="text"
                  name="district"
                  value={userData.district}
                  onChange={handleInputChange}
                  placeholder="Masukkan Kecamatan"
                  className="w-full h-[45px] text-[15px] px-4 p-2 border-2 rounded-md"
                />
              </div>
              <div>
                <label className="block text-[15px] font-bold mb-1 text-black">Kota</label>
                <input
                  type="text"
                  name="city"
                  value={userData.city}
                  onChange={handleInputChange}
                  placeholder="Masukkan Kota"
                  className="w-full h-[45px] text-[15px] px-4 p-2 border-2 rounded-md"
                />
              </div>
              <div>
                <label className="block text-[15px] font-bold mb-1 text-black">Provinsi</label>
                <input
                  type="text"
                  name="province"
                  value={userData.province}
                  onChange={handleInputChange}
                  placeholder="Masukkan Provinsi"
                  className="w-full h-[45px] text-[15px] px-4 p-2 border-2 rounded-md"
                />
              </div>
              <div>
                <label className="block text-[15px] font-bold mb-1 text-black">Kode Pos</label>
                <input
                  type="text"
                  name="postalCode"
                  value={userData.postalCode}
                  onChange={handleInputChange}
                  placeholder="Masukkan Kode Pos"
                  className="w-full h-[45px] text-[15px] px-4 p-2 border-2 rounded-md"
                />
              </div>
            </div>

            {/* Detail Login */}
            <h2 className="text-2xl font-bold mb-6 text-black">Detail Login</h2>
            <div className="mb-8">
              <label className="block text-[15px] font-bold mb-1 text-black">Email</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                placeholder="Masukkan Email"
                className="w-full h-[45px] text-[15px] px-4 p-2 border-2 rounded-md"
              />
            </div>

            <div className="mb-10">
              <label className="block text-[15px] font-bold mb-1 text-black">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan Password Baru"
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

      {/* Modal Success */}
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

      {/* Modal Logout */}
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
    </div>
  );
}