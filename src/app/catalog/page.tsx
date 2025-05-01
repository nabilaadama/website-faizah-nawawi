"use client";

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Header from "@/components/header";
import CatalogHero from '@/components/herocatalog';
import { Product } from "@/core/entities/product";
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase-config';
import Footer from '@/components/footer';
import Link from 'next/link';

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string>("newest");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const productsRef = collection(db, "products");
        const q = query(productsRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        const productsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as Product;
        });
        
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter and sort products when filter/sort options change
  useEffect(() => {
    let result = [...products];
    
    // Apply category filter
    if (selectedCategories.length > 0) {
      result = result.filter(product => selectedCategories.includes(product.category));
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query)
      );
    }
    
    // Apply sort
    result = result.sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "price-low":
          return a.basePrice - b.basePrice;
        case "price-high":
          return b.basePrice - a.basePrice;
        default:
          return 0;
      }
    });
    
    setFilteredProducts(result);
  }, [products, selectedCategories, sortOption, searchQuery]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section Component */}
      <CatalogHero 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
      />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Mobile Toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => document.getElementById('filters')?.classList.toggle('hidden')}
              className="w-full py-2 px-4 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Filter & Sort Options
            </button>
          </div>
          
          {/* Sidebar Filters */}
          <div id="filters" className="hidden lg:block w-full lg:w-64 shrink-0">
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <h3 className="font-bold text-lg mb-4 text-gray-800">Categories</h3>
              
              {/* Men's fashion */}
              <div className="flex items-center mb-3">
                <input 
                  type="checkbox" 
                  id="category-men"
                  checked={selectedCategories.includes("men")}
                  onChange={() => handleCategoryChange("men")}
                  className="h-4 w-4 text-[#FFC30C] border-gray-300 rounded focus:ring-[#FFC30C]"
                />
                <label htmlFor="category-men" className="ml-2 text-sm text-gray-700">
                  Men's fashion
                </label>
              </div>
              
              {/* Women's fashion */}
              <div className="flex items-center mb-3">
                <input 
                  type="checkbox" 
                  id="category-women"
                  checked={selectedCategories.includes("women")}
                  onChange={() => handleCategoryChange("women")}
                  className="h-4 w-4 text-[#FFC30C] border-gray-300 rounded focus:ring-[#FFC30C]"
                />
                <label htmlFor="category-women" className="ml-2 text-sm text-gray-700">
                  Women's fashion
                </label>
              </div>
              
              {/* Accessories */}
              <div className="flex items-center mb-3">
                <input 
                  type="checkbox" 
                  id="category-accessories"
                  checked={selectedCategories.includes("accessories")}
                  onChange={() => handleCategoryChange("accessories")}
                  className="h-4 w-4 text-[#FFC30C] border-gray-300 rounded focus:ring-[#FFC30C]"
                />
                <label htmlFor="category-accessories" className="ml-2 text-sm text-gray-700">
                  Accessories
                </label>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-4 text-gray-800">Sort by</h3>
              
              {/* Newest */}
              <div className="flex items-center mb-3">
                <input 
                  type="radio" 
                  id="sort-newest"
                  name="sort"
                  checked={sortOption === "newest"}
                  onChange={() => handleSortChange("newest")}
                  className="h-4 w-4 text-[#FFC30C] border-gray-300 focus:ring-[#FFC30C]"
                />
                <label htmlFor="sort-newest" className="ml-2 text-sm text-gray-700">
                  Newest
                </label>
              </div>
              
              {/* Price Low - High */}
              <div className="flex items-center mb-3">
                <input 
                  type="radio" 
                  id="sort-price-low"
                  name="sort"
                  checked={sortOption === "price-low"}
                  onChange={() => handleSortChange("price-low")}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="sort-price-low" className="ml-2 text-sm text-gray-700">
                  Price: Low to High
                </label>
              </div>
              
              {/* Price High - Low */}
              <div className="flex items-center mb-3">
                <input 
                  type="radio" 
                  id="sort-price-high"
                  name="sort"
                  checked={sortOption === "price-high"}
                  onChange={() => handleSortChange("price-high")}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="sort-price-high" className="ml-2 text-sm text-gray-700">
                  Price: High to Low
                </label>
              </div>
            </div>
          </div>
          
          {/* Product Grid */}
          <div className="flex-grow">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 text-[#FFC30C] animate-spin" />
                <span className="ml-2 text-[#FFC30C]">Loading products...</span>
              </div>
            ) : error ? (
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <p className="text-red-600">{error}</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <h3 className="text-xl font-medium text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  {selectedCategories.length > 0 || searchQuery 
                    ? "Try changing your filters or search query" 
                    : "There are no products available at the moment"}
                </p>
                {(selectedCategories.length > 0 || searchQuery) && (
                  <button 
                    onClick={() => {
                      setSelectedCategories([]);
                      setSearchQuery("");
                      setSortOption("newest");
                    }}
                    className="text-[#FFC30C]/70 hover:text-[#FFC30C] font-medium"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="mb-4 flex justify-between items-center">
                  <p className="text-gray-600">Showing {filteredProducts.length} products</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {filteredProducts.map((product) => (
                    <Link 
                      key={product.id} 
                      href={`/products/${product.slug || product.id}`}
                      className="block"
                    >
                      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-[0_0_12px_0_rgba(0,0,0,0.15)] transition-shadow duration-300">
                        <div className="relative aspect-square bg-gray-100">
                          {product.images.length > 0 ? (
                            <img 
                              src={product.images[0].url} 
                              alt={product.images[0].alt || product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <span className="text-gray-500">No image</span>
                            </div>
                          )}
                          {product.featured && (
                            <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-medium py-1 px-2 rounded">
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium text-gray-900">{product.name}</h3>
                          <p className="text-sm text-gray-500 capitalize mt-1">{product.category}</p>
                          <div className="mt-2 flex justify-between items-center">
                            <p className="font-semibold text-gray-900">Rp{product.basePrice.toLocaleString()}</p>
                            {product.variants.length > 0 && (
                              <span className="text-sm text-gray-500">
                                {product.variants.length} variants
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}