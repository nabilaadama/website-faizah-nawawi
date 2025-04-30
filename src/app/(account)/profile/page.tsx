'use client';

// src/pages/ProfilePage.tsx
import React, { useState } from 'react';
import Header from "@/components/header";

export default function ProfilePage() {
  // State untuk toggle show/hide password
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <aside className="w-64 border-r p-6">
          <nav className="flex flex-col gap-4">
            <div className="flex justify-between items-center bg-yellow-400 px-4 py-2 rounded cursor-pointer text-black">
              <span>Informasi Personal</span>
              <span>&gt;</span>
            </div>
            <div className="flex justify-between items-center px-4 py-2 rounded cursor-pointer hover:bg-gray-100 text-black">
              <span>Order</span>
              <span>&gt;</span>
            </div>
            <div className="flex justify-between items-center px-4 py-2 rounded cursor-pointer hover:bg-gray-100 text-black">
              <span>Logout</span>
              <span>&gt;</span>
            </div>
          </nav>
        </aside>

        {/* Content */}
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
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan Password Baru"
                  className="w-full border-2 rounded-[8px] p-2 text-black pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-blue-500 hover:underline"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button className="h-[45px] bg-yellow-400 text-white py-3 rounded-[18px] font-semibold hover:bg-yellow-500 shadow-md transition">
                Save Changes
              </button>
              <button className="h-[45px] bg-yellow-400 text-white py-3 rounded-[18px] font-semibold hover:bg-yellow-500 shadow-md transition">
                Log me out
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
