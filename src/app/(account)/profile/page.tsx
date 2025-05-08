'use client';
import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase-config'; // Pastikan path ini sesuai dengan struktur proyek Anda

export default function ProfilePage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signOut(auth);

      window.location.href = '/login'; 
    } catch (error) {
      console.error("Error logging out:", error);
      setError("Gagal logout. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex flex-1 relative">
        <main className="flex-1 p-10">
          <div className="border-2 rounded-[16px] p-8 max-w-3xl mx-auto">
            <h1 className="text-2xl font-semibold mb-6 text-black">Informasi Personal</h1>
            <div className="mb-8">
              <h3 className="font-semibold text-black mb-2">Nama Lengkap</h3>
              <input
                type="text"
                placeholder="Masukkan Nama Lengkap"
                className="w-full border-2 rounded-[8px] p-2 text-black"
              />
            </div>
            <h2 className="text-2xl font-semibold mb-6 text-black">Detail Login</h2>
            <div className="mb-8">
              <h3 className="font-semibold text-black mb-2">Email</h3>
              <input
                type="email"
                placeholder="Masukkan Email Baru"
                className="w-full border-2 rounded-[8px] p-2 text-black"
              />
            </div>
            <div className="mb-10">
              <h3 className="font-semibold text-black mb-2">Password</h3>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan Password Baru"
                  className="w-full border-2 rounded-[8px] p-2 text-black pr-12"
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
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-4">
              <button className="h-[45px] bg-yellow-400 text-white py-3 rounded-[18px] font-semibold hover:bg-yellow-500 shadow-md transition">
                Save Changes
              </button>
              <button 
                onClick={handleLogout}
                disabled={isLoading}
                className="h-[45px] bg-yellow-400 text-white py-3 rounded-[18px] font-semibold hover:bg-yellow-500 shadow-md transition"
              >
                {isLoading ? "Sedang Logout..." : "Log me out"}
              </button>
              <button className="h-[45px] bg-yellow-400 text-white py-3 rounded-[18px] font-semibold hover:bg-yellow-500 shadow-md transition">
                Delete Account
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}