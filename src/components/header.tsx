"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex items-center justify-between py-4 px-6 md:px-12 lg:px-20 bg-white shadow-sm">
      <div className="flex items-center">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
           <img
            src="\assets\logo-samping.png"
            alt="logo-samping"
            className="h-10 w-auto" 
           ></img>           
          </div>
        </Link>
      </div>

      <nav className="hidden md:flex items-center space-x-8">
        <Link href="/" className="text-gray-700 hover:text-yellow-500">
          Beranda
        </Link>
        <Link href="/catalog" className="font-medium text-black hover:text-yellow-500">
          Catalog
        </Link>
        <Link href="/booking" className="text-gray-700 hover:text-yellow-500">
          Booking Apointment
        </Link>
      </nav>

      {/* Cart and Login */}
      <div className="flex items-center space-x-6">
        <Link href="/cart" className="text-gray-700 hover:text-yellow-500">
          <ShoppingCart size={24} />
        </Link>
        <Link href="/login" className="text-gray-700 font-medium hover:text-yellow-500">
          Signin
        </Link>
      </div>
    </header>
  );
}