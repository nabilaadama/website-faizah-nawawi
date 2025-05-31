'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase-config';

export default function Sidebar() {
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      window.location.href = '/';
    } catch (err) {
      console.error('Logout error:', err);
      setError('Gagal logout. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
      setShowLogoutModal(false);
    }
  };

  return (
    <>
      <aside className="w-64 border-r p-6 bg-white h-full">
        <nav className="flex flex-col gap-4">
          <Link href="/profile">
            <div
              className={`flex justify-between items-center px-4 py-2 rounded cursor-pointer ${
                isActive('/profile') ? 'bg-yellow-400 text-black' : 'hover:bg-gray-100 text-black'
              }`}
            >
              <span>Informasi Personal</span>
              <span>&gt;</span>
            </div>
          </Link>

          <Link href="/orders">
            <div
              className={`flex justify-between items-center px-4 py-2 rounded cursor-pointer ${
                isActive('/orders') ? 'bg-yellow-400 text-black' : 'hover:bg-gray-100 text-black'
              }`}
            >
              <span>Order</span>
              <span>&gt;</span>
            </div>
          </Link>

          <div
            onClick={() => setShowLogoutModal(true)}
            className="flex justify-between items-center px-4 py-2 rounded cursor-pointer hover:bg-gray-100 text-black"
          >
            <span>Logout</span>
            <span>&gt;</span>
          </div>
        </nav>
      </aside>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8 flex flex-col items-center justify-center text-center">
            <h2 className="text-lg font-bold mb-4 text-black">Konfirmasi Logout</h2>
            <p className="text-sm mb-6 text-gray-700"> 
              Apakah Anda yakin ingin logout dari akun ini?
            </p>
            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>
            )}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-md text-sm hover:bg-gray-300"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
              >
                {isLoading ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
