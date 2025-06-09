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
  ShoppingCart,
  CalendarCheck,
  ListOrdered,
  Boxes,
} from 'lucide-react';

interface SidebarItem {
  label: string;
  link?: string;
  icon?: React.ReactNode;
  children?: SidebarItem[];
}

const iconSize = 20;

const sidebarItems: SidebarItem[] = [
  { label: 'Dashboard', link: '/admin', icon: <Home size={iconSize} /> },
  {
    label: 'Manage data',
    children: [
      { label: 'User', link: '/admin/users', icon: <User size={iconSize} /> },
      { label: 'Product', link: '/admin/products', icon: <Boxes size={iconSize} /> },
      { label: 'Category', link: '/admin/products/category', icon: <ListOrdered size={iconSize} /> },
      { label: 'Bank Account', link: '/admin/bank-account', icon: <Package size={iconSize} /> },
    ],
  },
  {
    label: 'Manage Transaction',
    children: [
      { label: 'Order', link: '/admin/order', icon: <ShoppingCart size={iconSize} /> },
      { label: 'Booking Appointment', link: '/admin/bookingappoinment', icon: <CalendarCheck size={iconSize} /> },
    ],
  },
  { label: 'Profile Admin', link: '/admin/profile', icon: <User size={21} /> },
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
      <div className={`h-full ${isOpen ? 'w-80' : 'w-20'} bg-[#A67C52] text-white flex flex-col justify-between transition-all duration-300`}>
        {/* Header */}
        <div>
          <div className="p-4 flex items-center justify-between">
            {isOpen && (
              <img src="/assets/logosamping.png" alt="Admin Panel Logo" className="h-12 w-auto mx-auto" />
            )}
            <button
              onClick={toggleSidebar}
              className={`text-white ml-2 ${!isOpen ? 'ml-auto mr-3' : ''}`}
            >
              {isOpen ? <ArrowLeft size={iconSize} /> : <Menu size={iconSize} />}
            </button>

          </div>

          {/* Navigation */}
          <nav className="p-4">
            <ul>
              {sidebarItems.map((item, index) => {
                const isDropdown = !!item.children;
                const isActive = pathname === item.link;
                const isDropdownOpen = openDropdowns[item.label];

                return (
                  <React.Fragment key={index}>
                    {item.link ? (
                      <li className={`mb-3 ${index !== 0 ? 'mt-6' : ''}`}>
                        <Link
                          href={item.link}
                          className={`flex items-center gap-3 py-2 px-4 rounded transition-colors ${
                            isActive ? 'bg-[#8C6A4F] font-semibold' : 'hover:bg-[#A07F62]'
                          }`}
                        >
                          <div className="min-w-[20px]">{item.icon}</div>
                          {isOpen && <span>{item.label}</span>}
                        </Link>
                      </li>
                    ) : (
                      <>
                        <li className={`mb-3 ${index !== 0 ? 'mt-6' : ''}`}>
                          <button
                            onClick={() => toggleDropdown(item.label)}
                            className="w-full flex items-center justify-between py-2 px-4 rounded hover:bg-[#A07F62] transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              {item.icon && <div className="min-w-[20px]">{item.icon}</div>}
                              {isOpen && <span>{item.label}</span>}
                            </div>
                            {isOpen && (isDropdownOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />)}
                          </button>
                        </li>

                        {(isDropdownOpen || !isOpen) && item.children?.map((child, idx) => {
                          const isChildActive = pathname === child.link;
                          return (
                            <li key={idx} className="mb-3">
                              <Link
                                href={child.link!}
                                className={`flex items-center gap-3 py-2 px-4 rounded transition-colors ${
                                  isChildActive ? 'bg-[#8C6A4F] font-semibold' : 'hover:bg-[#A07F62]'
                                }`}
                              >
                                <div className="min-w-[20px]">{child.icon}</div>
                                {isOpen && <span>{child.label}</span>}
                              </Link>
                            </li>
                          );
                        })}
                      </>
                    )}
                  </React.Fragment>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-4">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center justify-center gap-2 py-2 px-4 rounded hover:bg-[#A07F62] transition-colors w-full"
          >
            <LogOut size={22} />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Logout Modal */}
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
