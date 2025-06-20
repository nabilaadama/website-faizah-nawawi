"use client";

import { useCart } from '@/context/CartContext';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Link from 'next/link';
import { Minus, Plus, Trash2, Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import Image from 'next/image';

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    user,
    loading,
  } = useCart();
  
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState(new Set());

  useEffect(() => {
    if (cartItems.length > 0) {
      setSelectedItems(new Set(cartItems.map(item => item.id)));
    }
  }, [cartItems]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user && !loading) {
        router.push('/login?redirect=/cart');
      }
    });

    return () => unsubscribe();
  }, [loading, router]);

  const handleItemSelect = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === cartItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItems.map(item => item.id)));
    }
  };

  const selectedItemsTotal = cartItems
    .filter(item => selectedItems.has(item.id))
    .reduce((total, item) => total + (item.price * item.quantity), 0);

  const selectedItemsCount = cartItems
    .filter(item => selectedItems.has(item.id))
    .reduce((count, item) => count + item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Loading your cart...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Breadcrumb Navigation */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 text-sm">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link href="/" className="text-gray-700 hover:text-[#FFC30C]">Beranda</Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                  </svg>
                  <span className="ml-1 text-gray-500 md:ml-2">My Cart</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">My Cart</h1>
        
        {!user ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">You need to login to view your cart</p>
            <Link
              href="/login?redirect=/cart"
              className="px-6 py-2 bg-[#FFC30C] text-white rounded-full hover:bg-yellow-500 transition-colors duration-200 inline-block"
            >
              Login
            </Link>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <Link
              href="/products"
              className="px-6 py-2 bg-[#FFC30C] text-white rounded-full hover:bg-yellow-500 transition-colors duration-200 inline-block"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              {/* Select All Checkbox */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="select-all"
                    checked={selectedItems.size === cartItems.length && cartItems.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-[#FFC30C] bg-gray-100 border-gray-300 rounded focus:ring-[#FFC30C] focus:ring-2"
                  />
                  <label htmlFor="select-all" className="ml-2 text-sm font-medium text-gray-900">
                    Select All Items ({cartItems.length})
                  </label>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex gap-4">
                      {/* Checkbox */}
                      <div className="flex items-start pt-2">
                        <input
                          type="checkbox"
                          id={`item-${item.id}`}
                          checked={selectedItems.has(item.id)}
                          onChange={() => handleItemSelect(item.id)}
                          className="w-4 h-4 text-[#FFC30C] bg-gray-100 border-gray-300 rounded focus:ring-[#FFC30C] focus:ring-2"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 flex-grow">
                        {/* Product Image */}
                        <div className="relative w-full sm:w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                          {item.image ? (
                            <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover"
                          />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <span className="text-gray-500">No image</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Product Info */}
                        <div className="flex-grow">
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          
                          {/* Variant Info */}
                          {item.variant && (
                            <div className="text-sm text-gray-500 mt-1">
                              {item.variant.color && <span>Color: {item.variant.color}</span>}
                              {item.variant.size && <span className="ml-2">Size: {item.variant.size}</span>}
                            </div>
                          )}
                          
                          {/* Price */}
                          <p className="font-semibold text-gray-900 mt-2">Rp{item.price.toLocaleString()}</p>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center mt-4">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 border border-gray-300 rounded-l-md hover:bg-gray-100"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-1 border-t border-b border-gray-300">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 border border-gray-300 rounded-r-md hover:bg-gray-100"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            
                            {/* Remove Button */}
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="ml-4 text-red-500 hover:text-red-700 flex items-center"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              <span className="text-sm">Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Selected Items ({selectedItemsCount})</span>
                  <span className="font-medium">Rp{selectedItemsTotal.toLocaleString()}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>Rp{selectedItemsTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <Info className="w-4 h-4 mr-1" />
                  <span>
                    Contact  
                    <a href="https://wa.me/6285225988870" className="text-blue-600 hover:underline"> admin </a>        
                      to check shipping costs</span>
                </div>
                
                <button
                  onClick={() => {
                    if (selectedItems.size === 0) {
                      alert('Please select at least one item to checkout');
                      return;
                    }
                    // You can pass selected items to checkout page via state or context
                    const selectedCartItems = cartItems.filter(item => selectedItems.has(item.id));
                    // Store selected items in sessionStorage or pass via router state
                    sessionStorage.setItem('selectedCartItems', JSON.stringify(selectedCartItems));
                    router.push('/checkout');
                  }}
                  disabled={selectedItems.size === 0}
                  className={`block w-full py-3 px-6 text-white text-center rounded-full transition-colors duration-200 ${
                    selectedItems.size === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-[#FFC30C] hover:bg-yellow-500'
                  }`}
                >
                  Checkout {selectedItems.size > 0 && `(${selectedItems.size} items)`}
                </button>
                
                <Link
                  href="/products"
                  className="block w-full py-2 px-6 text-center text-gray-700 hover:text-[#FFC30C]"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}