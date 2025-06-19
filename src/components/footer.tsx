import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Youtube, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white pt-12 pb-6 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Social Media */}
          <div>
            <Link href="/">
              <div className="flex items-center mb-6">
                <img
                  src="/assets/logosamping.png"
                  alt="logo-samping"
                  className="h-10 w-auto"
                />
              </div>
            </Link>

            <div className="flex flex-col space-y-2">
              <Link href="https://www.facebook.com/faizah.nawawi.9?mibextid=rS40aB7S9Ucbxw6v" target="_blank" className="flex items-center text-gray-600 hover:text-gray-800">
                <Facebook size={20} className="mr-2" /> Facebook
              </Link>
              <Link href="https://youtube.com/@faizahnawawichannel5164?si=ulwmbfpIZ2xCzFEu" target="_blank" className="flex items-center text-gray-600 hover:text-gray-800">
                <Youtube size={20} className="mr-2" /> Youtube
              </Link>
              <Link href="https://www.instagram.com/faizahnawawi_fashion?igsh=czMxM3Bqc2ZsZTVx" target="_blank" className="flex items-center text-gray-600 hover:text-gray-800">
                <Instagram size={20} className="mr-2" /> Instagram
              </Link>
              <Link href="https://www.tiktok.com/@faizahnawawi_official?_t=ZS-8x8Wty5vmMs&_r=1" target="_blank" className="flex items-center text-gray-600 hover:text-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M9 12a4 4 0 1 0 8 0 4 4 0 1 0-8 0"/>
                  <path d="M12 2a3 3 0 0 0-3 3v4"/>
                  <path d="M9 14v6"/>
                </svg>
                TikTok
              </Link>
            </div>
          </div>

          {/* Kategori */}
          <div>
            <h3 className="text-gray-400 font-medium mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-600 hover:text-gray-800">Wedding Collection</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-800">Formal Wear</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-800">Casual Look</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-800">Accessories</Link></li>
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h3 className="text-gray-400 font-medium mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-600 hover:text-gray-800">Custom Tailoring</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-800">Styling Consultation</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-800">Personal Shopping</Link></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-gray-400 font-medium mb-4">Information</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-600 hover:text-gray-800">About Us</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-800">Contact</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-800">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">Faizah Nawawi © 2025</p>
          <div>
            <img
              src="/assets/logo-bni.png"
              alt="BNI Logo"
              className="h-6"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}