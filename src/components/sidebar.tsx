'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, ShoppingCart, User, Calendar, Package, Menu, ArrowLeft } from 'lucide-react'; // Ganti X dengan ArrowLeft

interface SidebarItem {
  label: string;
  link: string;
  icon: React.ReactNode;
}

const sidebarItems: SidebarItem[] = [
  { label: 'Dashboard', link: '/admin', icon: <Home size={20} /> },
  { label: 'User', link: '/admin/users', icon: <Users size={20} /> },
  { label: 'Product', link: '/admin/products', icon: <ShoppingCart size={20} /> },
  { label: 'Order', link: '/admin/order', icon: <Package size={20} /> },
  { label: 'Booking Appointment', link: '/admin/bookingappoinment', icon: <Calendar size={20} /> },
  { label: 'Profile Admin', link: '/admin/profile', icon: <User size={20} /> },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname(); 
  const [isOpen, setIsOpen] = useState(true); 

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className={`h-screen ${isOpen ? 'w-72' : 'w-20'} bg-[#A67C52] text-white flex flex-col transition-all duration-300`}>
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        {isOpen && (
          <img 
            src="/assets/logosamping.png"
            alt="Admin Panel Logo" 
            className="h-12 w-auto"
          />
        )}
        <button onClick={toggleSidebar} className="text-white">
          {isOpen ? <ArrowLeft size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-4">
          {sidebarItems.map((item, index) => {
            const isActive = pathname === item.link;
            return (
              <li key={index}>
                <Link
                  href={item.link}
                  className={`flex items-center gap-3 py-2 px-4 rounded transition-colors ${
                    isActive ? 'bg-[#5E4734] font-semibold' : 'hover:bg-[#8C6A4F]'
                  }`}
                >
                  {item.icon}
                  {isOpen && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
