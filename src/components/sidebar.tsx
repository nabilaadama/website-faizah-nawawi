'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Users,
  User,
  Package,
  Menu,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  LogOut,
} from 'lucide-react';

interface SidebarItem {
  label: string;
  link?: string;
  icon?: React.ReactNode;
  children?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
  { label: 'Dashboard', link: '/admin', icon: <Home size={20} /> },
  {
    label: 'Manage Data',
    icon: <Users size={20} />,
    children: [
      { label: 'User', link: '/admin/users' },
      { label: 'Product', link: '/admin/products' },
      { label: 'Tambah Product', link: '/admin/products/new' },
    ],
  },
  {
    label: 'Manage Transaction',
    icon: <Package size={20} />,
    children: [
      { label: 'Order', link: '/admin/order' },
      { label: 'Booking Appointment', link: '/admin/bookingappoinment' },
    ],
  },
  {
    label: 'Manage Account',
    icon: <User size={20} />,
    children: [
      { label: 'Profile Admin', link: '/admin/profile' },
    ],
  },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleDropdown = (label: string) => {
    setOpenDropdowns(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Replace with your actual logout API call
      // await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`h-screen ${isOpen ? 'w-72' : 'w-20'} bg-[#A67C52] text-white flex flex-col justify-between transition-all duration-300 fixed`}>
        {/* Header */}
        <div>
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

          {/* Navigation */}
          <nav className="p-4">
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
                                className={`flex items-center py-1.5 px-3 rounded text-sm ${
                                  isChildActive ? 'bg-[#5E4734] font-semibold' : 'hover:bg-[#8C6A4F]'
                                }`}
                              >
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

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center justify-center gap-2 py-2 px-4 rounded hover:bg-[#8C6A4F] transition-colors w-full"
          >
            <LogOut size={20} />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <div className="flex flex-col items-center">
              <LogOut className="h-12 w-12 text-red-600" />
              <h2 className="text-xl font-bold text-black mt-3">Logout</h2>
              <p className="text-gray-600 mt-1">Apakah Anda yakin ingin keluar?</p>
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="bg-gray-300 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-400 transition-colors"
              >
                Batalkan
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className={`bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 transition-colors ${
                  isLoggingOut ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoggingOut ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging out...
                  </span>
                ) : (
                  'Logout'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;