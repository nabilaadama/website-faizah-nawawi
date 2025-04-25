
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
                src="\assets\logosamping.png"
                alt="logo-samping"
                className="h-10 w-auto" 
              ></img>
              </div>
            </Link>
            
            <div className="flex flex-col space-y-2">
              <Link href="#" className="flex items-center text-gray-600 hover:text-gray-800">
                <Facebook size={20} className="mr-2" /> Facebook
              </Link>
              <Link href="#" className="flex items-center text-gray-600 hover:text-gray-800">
                <Youtube size={20} className="mr-2" /> Youtube
              </Link>
              <Link href="#" className="flex items-center text-gray-600 hover:text-gray-800">
                <Instagram size={20} className="mr-2" /> Instagram
              </Link>
              <Link href="#" className="flex items-center text-gray-600 hover:text-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M9 12a4 4 0 1 0 8 0 4 4 0 1 0-8 0"/>
                  <path d="M12 2a3 3 0 0 0-3 3v4"/>
                  <path d="M9 14v6"/>
                </svg>
                TikTok
              </Link>
            </div>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="text-gray-400 font-medium mb-4">Kategori</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-600 hover:text-gray-800">Kategori1</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-800">Kategori2</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-800">Kategori3</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-800">Kategori4</Link></li>
            </ul>
          </div>
          
          {/* Development */}
          <div>
            <h3 className="text-gray-400 font-medium mb-4">Prototyping</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-600 hover:text-gray-800">Design systems</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-800">Pricing</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-800">Security</Link></li>
            </ul>
          </div>
          
          {/* Community */}
          <div>
            <h3 className="text-gray-400 font-medium mb-4">Discussion Forums</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-600 hover:text-gray-800">Code of Conduct</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-800">Contributing</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-800">API Reference</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">Faizah Nawawi © 2025</p>
          <div>
            <img 
            src="/assets/logo-bni.png" 
            alt="BNI Logo" 
            className="h-6" />
          </div>
        </div>
      </div>
    </footer>
  );
}