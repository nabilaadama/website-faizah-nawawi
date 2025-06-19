"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Facebook, Youtube, Instagram } from "lucide-react";
import { useState, useEffect } from "react";

export default function Footer() {
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  const getNavLinkClass = (path: string) => {
    const baseClass = "hover:text-yellow-500 transition-colors duration-200";
    const activeClass = "text-[#FFC30C] font-medium";
    return pathname === path
      ? `${baseClass} ${activeClass}`
      : `${baseClass} text-gray-700`;
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <footer className="bg-white pt-12 pb-6 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Social Media */}
          <div>
            <Link href="/" passHref>
              <div className="flex items-center mb-6 cursor-pointer">
                <Image
                  src="/assets/logosamping.png"
                  alt="logo-samping"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                  priority
                />
              </div>
            </Link>

            {isClient && (
              <div className="flex flex-col space-y-2">
                <Link
                  href="https://www.facebook.com/faizah.nawawi.9?mibextid=rS40aB7S9Ucbxw6v"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-600 hover:text-gray-800"
                >
                  <Facebook size={20} className="mr-2" /> Facebook
                </Link>
                <Link
                  href="https://youtube.com/@faizahnawawichannel5164?si=ulwmbfpIZ2xCzFEu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-600 hover:text-gray-800"
                >
                  <Youtube size={20} className="mr-2" /> Youtube
                </Link>
                <Link
                  href="https://www.instagram.com/faizahnawawi_fashion?igsh=czMxM3Bqc2ZsZTVx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-600 hover:text-gray-800"
                >
                  <Instagram size={20} className="mr-2" /> Instagram
                </Link>
                <Link
                  href="https://www.tiktok.com/@faizahnawawi_official?_t=ZS-8x8Wty5vmMs&_r=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-600 hover:text-gray-800"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="M9 12a4 4 0 1 0 8 0 4 4 0 1 0-8 0" />
                    <path d="M12 2a3 3 0 0 0-3 3v4" />
                    <path d="M9 14v6" />
                  </svg>
                  TikTok
                </Link>
              </div>
            )}
          </div>

          {/* Kategori */}
          <div>
            <h3 className="text-gray-400 font-medium mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Ethnic Wear
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Muslim Wear
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Dress
                </Link>
              </li>
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h3 className="text-gray-400 font-medium mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/booking" className="text-gray-600 hover:text-gray-800">
                  Custom Tailoring
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-gray-600 hover:text-gray-800">
                  Styling Consultation
                </Link>
              </li>
              <li>
                <Link href="/product" className="text-gray-600 hover:text-gray-800">
                  Personal Shopping
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-gray-400 font-medium mb-4">Information</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-gray-800">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-gray-800">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-800">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            Faizah Nawawi © 2025
          </p>
          <div>
            <Image
              src="/assets/logo-bni.png"
              alt="BNI Logo"
              width={80}
              height={24}
              className="h-6"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
