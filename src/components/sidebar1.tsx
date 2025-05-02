'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-64 border-r p-6 bg-white">
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

        <div className="flex justify-between items-center px-4 py-2 rounded cursor-pointer hover:bg-gray-100 text-black">
          <span>Logout</span>
          <span>&gt;</span>
        </div>
      </nav>
    </aside>
  );
}
