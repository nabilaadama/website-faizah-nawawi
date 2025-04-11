"use client";

import { Search } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative w-full h-64 md:h-80 lg:h-96">
      <img 
        className="flex inset-0 bg-cover bg-center" 
        src="\assets\-catalog.png"
        alt="fashion show"
      ></img>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">KOLEKSI ALA ALA ALA</h1>
        <p className="text-sm md:text-base mb-6">koleksi sekian sekian sekian</p>
        
        <div className="relative w-full max-w-md">
          <input 
            type="text" 
            className="w-full py-2 px-4 pr-10 rounded-full bg-white bg-opacity-80 text-gray-800 focus:outline-none"
            placeholder="Search..."
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600">
            <Search size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}