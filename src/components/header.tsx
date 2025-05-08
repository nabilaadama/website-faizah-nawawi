"use client";

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, CircleUserRound } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { auth } from '@/lib/firebase/firebase-config';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

export default function Header() {
  const { itemCount } = useCart();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getNavLinkClass = (path: string) => {
    const baseClass = "hover:text-yellow-500 transition-colors duration-200";
    const activeClass = "text-[#FFC30C] font-medium";
    return pathname === path 
      ? `${baseClass} ${activeClass}`
      : `${baseClass} text-gray-700`;
  };

  if (loading) {
    return (
      <header className="flex items-center justify-between py-4 px-6 md:px-12 lg:px-20 bg-white shadow-sm sticky top-0 z-50">
        {/* Skeleton loading */}
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        <div className="flex space-x-6">
          <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </header>
    );
  }

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
      <Link href="/cart" className={`relative ${getNavLinkClass("/cart")}`}>
        <ShoppingCart className="w-5 h-5" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#FFC30C] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </Link>
      
      {user ? (
        <Link 
          href="/profile" 
          className={getNavLinkClass("/profile")}
        >
          <CircleUserRound className="w-6 h-6" />
        </Link>
      ) : (
        <Link 
          href="/register" 
          className={getNavLinkClass("/register")}
        >
          Sign Up
        </Link>
      )}
    </div>

    </header>
  );
}