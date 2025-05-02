"use client";

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const { itemCount } = useCart();
  const pathname = usePathname();

  const getNavLinkClass = (path: string) => {
    const baseClass = "hover:text-yellow-500 transition-colors duration-200";
    const activeClass = "text-[#FFC30C] font-medium";
    return pathname === path 
      ? `${baseClass} ${activeClass}`
      : `${baseClass} text-gray-700`;
  };

  return (
    <header className="flex items-center justify-between py-4 px-6 md:px-12 lg:px-20 bg-white shadow-sm sticky top-0 z-50">
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/logosamping.png"
            alt="Faizah Nawawi Logo"
            width={120}
            height={40}
            className="h-10 w-auto"
          />
        </Link>
      </div>

      <nav className="hidden md:flex items-center space-x-8">
        <Link href="/" className={getNavLinkClass("/")}>
          Beranda
        </Link>
        <Link href="/about" className={getNavLinkClass("/about")}>
          About Us
        </Link>
        <Link href="/products" className={getNavLinkClass("/products")}>
          Catalog
        </Link>
        <Link href="/booking" className={getNavLinkClass("/booking")}>
          Booking Appointment
        </Link>
      </nav>

      <div className="flex items-center space-x-6">
        <Link href="/cart" className="relative hover:text-[#FFC30C] transition-colors duration-200">
          <ShoppingCart className="w-5 h-5" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#FFC30C] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Link>
        <Link 
          href="/register" 
          className="text-gray-700 font-medium hover:text-[#FFC30C] transition-colors duration-200"
        >
          Sign Up
        </Link>
      </div>
    </header>
  );
}