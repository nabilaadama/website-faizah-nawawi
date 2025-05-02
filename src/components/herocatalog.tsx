"use client";
import { Search } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
}

export default function CatalogHero({ searchQuery, setSearchQuery, handleSearch }: HeroProps) {
  return (
    <div className="relative text-white">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: 'url("/assets/hero-catalog.png")' }}
      />
      
      {/* Optional overlay for better text readability */}
      <div className="absolute inset-0 bg-black opacity-30 z-10"></div>
      
      {/* Content */}
      <div className="container relative z-20 mx-auto px-4 py-16 md:py-24">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Our Collection</h1>
          <p className="text-lg opacity-80 mb-8">Discover our latest products and find your perfect style</p>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3 px-4 pr-12 rounded-full opacity-80 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Search className="h-5 w-5 text-gray-500" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}