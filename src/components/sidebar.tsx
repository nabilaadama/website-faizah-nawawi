'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  ShoppingCart,
  User,
  Calendar,
  Package,
  Menu,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface SidebarItem {
  label: string;
  link?: string;
  icon: React.ReactNode;
  children?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
  { label: 'Dashboard', link: '/admin', icon: <Home size={20} /> },
  {
    label: 'Manage Data',
    icon: <Users size={20} />,
    children: [
      { label: 'User', link: '/admin/users', icon: <Users size={18} /> },
      { label: 'Product', link: '/admin/products', icon: <ShoppingCart size={18} /> },
    ],
  },
  {
    label: 'Manage Transaction',
    icon: <Package size={20} />,
    children: [
      { label: 'Order', link: '/admin/order', icon: <Package size={18} /> },
      { label: 'Booking Appointment', link: '/admin/bookingappoinment', icon: <Calendar size={18} /> },
    ],
  },
  {
    label: 'Manage Account',
    icon: <User size={20} />,
    children: [
      { label: 'Profile Admin', link: '/admin/profile', icon: <User size={18} /> },
    ],
  },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});

  const toggleSidebar = () => setIsOpen(!isOpen);

  const toggleDropdown = (label: string) => {
    setOpenDropdowns(prev => ({ ...prev, [label]: !prev[label] }));
  };

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
        <ul className="space-y-2">
          {sidebarItems.map((item, index) => {
            const isDropdown = !!item.children;
            const isActive = pathname === item.link;
            const isDropdownOpen = openDropdowns[item.label];

            return (
              <li key={index}>
                {item.link ? (
                  <Link
                    href={item.link}
                    className={`flex items-center gap-3 py-2 px-4 rounded transition-colors ${
                      isActive ? 'bg-[#5E4734] font-semibold' : 'hover:bg-[#8C6A4F]'
                    }`}
                  >
                    {item.icon}
                    {isOpen && <span>{item.label}</span>}
                  </Link>
                ) : (
                  <button
                    onClick={() => toggleDropdown(item.label)}
                    className="w-full flex items-center justify-between py-2 px-4 rounded hover:bg-[#8C6A4F] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      {isOpen && <span>{item.label}</span>}
                    </div>
                    {isOpen && (isDropdownOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />)}
                  </button>
                )}

                {/* Sub-items */}
                {isDropdown && isDropdownOpen && isOpen && (
                  <ul className="ml-8 mt-1 space-y-1">
                    {item.children!.map((child, idx) => {
                      const isChildActive = pathname === child.link;
                      return (
                        <li key={idx}>
                          <Link
                            href={child.link!}
                            className={`flex items-center gap-2 py-1.5 px-3 rounded text-sm ${
                              isChildActive ? 'bg-[#5E4734] font-semibold' : 'hover:bg-[#8C6A4F]'
                            }`}
                          >
                            {child.icon}
                            <span>{child.label}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
