"use client";

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Header from "@/components/header";
import CatalogHero from '@/components/herocatalog';
import { Product, Category, ProductVariant } from "@/core/entities/product";
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase-config';
import Footer from '@/components/footer';
import Link from 'next/link';

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string>("newest");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesRef = collection(db, "categories");
        const q = query(categoriesRef, orderBy("name", "asc"));
        const querySnapshot = await getDocs(q);
        
        const categoriesData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            slug: data.slug,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as Category;
        });
        
        setCategories(categoriesData);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
      }
    };

    fetchCategories();
  }, []);

  // Fetch all product variants
  useEffect(() => {
    const fetchProductVariants = async () => {
      try {
        const variantsRef = collection(db, "productVariants");
        const querySnapshot = await getDocs(variantsRef);
        
        const variantsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            productId: data.productId || "",
            size: data.size || "",
            color: data.color || "",
            price: data.price || 0,
            stock: data.stock || 0,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as ProductVariant;
        });
        
        setProductVariants(variantsData);
      } catch (err) {
        console.error("Error fetching product variants:", err);
      }
    };

    fetchProductVariants();
  }, []);

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
          // Ensure categoryId is always an array
          const categoryId = Array.isArray(data.categoryId) ? data.categoryId : 
                            data.categoryId ? [data.categoryId] : [];
          // Ensure categoryName is always an array if present
          const categoryName = Array.isArray(data.categoryName) ? data.categoryName : 
                              data.categoryName ? [data.categoryName] : undefined;
          
          return {
            id: doc.id,
            name: data.name || "Unnamed Product",
            slug: data.slug || doc.id,
            description: data.description || "",
            basePrice: data.basePrice || 0,
            stock: data.stock || 0,
            categoryId: categoryId,
            categoryName: categoryName,
            images: data.images || [],
            featured: data.featured || false,
            available: data.available !== undefined ? data.available : true,
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
      result = result.filter(product => {
        // Use categoryId array directly since it's now an array in the new entity format
        const productCategories = product.categoryId || [];
        
        // Product passes filter if it has at least one of the selected categories
        return productCategories.some(catId => selectedCategories.includes(catId));
      });
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) || 
        (product.description && product.description.toLowerCase().includes(query))
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

  // Helper function to get primary image or first image
  const getProductImage = (product: Product) => {
    if (!product.images || product.images.length === 0) {
      return null;
    }
    
    // First try to find the primary image
    const primaryImage = product.images.find(img => img.isPrimary === true);
    
    // If a primary image is found, return it, otherwise return the first image
    return primaryImage || product.images[0];
  };

  // Helper function to check if product has variants
  const hasVariants = (productId: string): boolean => {
    if (!productId) return false;
    return productVariants.some(variant => variant.productId === productId);
  };

  // Helper function to check product availability based on stock and variants
  const isProductAvailable = (product: Product): boolean => {
    // If product has variants, check if any variant has stock
    if (hasVariants(product.id)) {
      const variants = productVariants.filter(v => v.productId === product.id);
      return variants.some(variant => variant.stock > 0);
    }
    
    // If no variants, check product's own stock
    return product.stock > 0 && product.available;
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Get category names for a product
  const getProductCategories = (product: Product): string => {
    // Use categoryName directly if available
    if (product.categoryName && product.categoryName.length > 0) {
      return product.categoryName.join(", ");
    }
    
    // Otherwise, look up category names from IDs
    const productCategoryIds = product.categoryId || [];
    
    if (productCategoryIds.length === 0) return "Uncategorized";
    
    // Get category names
    const categoryNames = productCategoryIds
      .map(id => {
        const category = categories.find(cat => cat.id === id);
        return category?.name;
      })
      .filter(Boolean); // Remove undefined values
    
    return categoryNames.length > 0 
      ? categoryNames.join(", ") 
      : "Unknown Category";
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
              
              {categories.length === 0 ? (
                <p className="text-sm text-gray-500">Loading categories...</p>
              ) : (
                categories.map(category => (
                  <div className="flex items-center mb-3" key={category.id}>
                    <input 
                      type="checkbox" 
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleCategoryChange(category.id)}
                      className="h-4 w-4 text-[#FFC30C] border-gray-300 rounded focus:ring-[#FFC30C]"
                    />
                    <label htmlFor={`category-${category.id}`} className="ml-2 text-sm text-gray-700">
                      {category.name}
                    </label>
                  </div>
                ))
              )}
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
                  className="h-4 w-4 text-[#FFC30C] border-gray-300 focus:ring-[#FFC30C]"
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
                  className="h-4 w-4 text-[#FFC30C] border-gray-300 focus:ring-[#FFC30C]"
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
                          {(() => {
                            const imageToShow = getProductImage(product);
                            
                            if (imageToShow) {
                              return (
                                <img 
                                  src={imageToShow.url} 
                                  alt={imageToShow.alt || product.name}
                                  className="w-full h-full object-cover"
                                />
                              );
                            } else {
                              return (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                  <span className="text-gray-500">No image</span>
                                </div>
                              );
                            }
                          })()}
                          {product.featured && (
                            <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-medium py-1 px-2 rounded">
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium text-gray-900">{product.name}</h3>
                          <p className="text-sm text-gray-500 capitalize mt-1">{getProductCategories(product)}</p>
                          <div className="mt-2 flex justify-between items-center">
                            <p className="font-semibold text-gray-900">Rp{product.basePrice.toLocaleString()}</p>
                            {hasVariants(product.id) && (
                              <span className="text-sm text-gray-500">
                                {productVariants.filter(v => v.productId === product.id).length} variants
                              </span>
                            )}
                          </div>
                          {!isProductAvailable(product) && (
                            <p className="mt-2 text-red-500 text-sm">Out of stock</p>
                          )}
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