"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase-config';
import { Product, ProductImage, ProductVariant } from '@/core/entities/product';
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Star } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-hot-toast';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

interface ProductWithReviews extends Product {
  reviews?: Review[];
}

export default function ProductDetails() {
  const params = useParams();
  const slug = params?.slug as string;
  const [product, setProduct] = useState<ProductWithReviews | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        if (!slug) {
          setError("Product slug is missing");
          return;
        }

        // Try to get by slug first
        const productsRef = collection(db, "products");
        const slugQuery = query(productsRef, where("slug", "==", slug));
        const slugSnapshot = await getDocs(slugQuery);
        
        if (!slugSnapshot.empty) {
          const doc = slugSnapshot.docs[0];
          const data = doc.data();
          const productData = {
            ...data,
            id: doc.id,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as ProductWithReviews;
          setProduct(productData);
          setSelectedImage(productData.images?.[0] || null);
          setSelectedVariant(productData.variants?.[0] || null);
        } else {
          // Fallback to get by ID
          const docRef = doc(db, "products", slug);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            const productData = {
              ...data,
              id: docSnap.id,
              createdAt: data.createdAt?.toDate() || new Date(),
              updatedAt: data.updatedAt?.toDate() || new Date(),
            } as ProductWithReviews;
            setProduct(productData);
            setSelectedImage(productData.images?.[0] || null);
            setSelectedVariant(productData.variants?.[0] || null);
          } else {
            setError("Product not found");
          }
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      productId: product.id,
      name: product.name,
      price: selectedVariant?.price || product.basePrice,
      image: product.images[0]?.url || '',
      variant: selectedVariant
        ? {
            color: selectedVariant.color,
            size: selectedVariant.size,
          }
        : undefined,
    });

    // Show success notification
    toast.success(`${product.name} added to cart!`, {
      position: 'bottom-right',
      duration: 3000,
    });
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-20 flex justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-8 bg-blue-200 rounded-full mb-2"></div>
            <p className="text-gray-600">Loading product...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="bg-red-50 p-6 rounded-lg text-center">
            <h3 className="text-lg font-medium text-red-800 mb-2">Error</h3>
            <p className="text-red-600">{error}</p>
            <Link 
              href="/catalog"
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-block"
            >
              Back to Catalog
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Product Not Found</h3>
            <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
            <Link 
              href="/catalog"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-block"
            >
              Back to Catalog
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const displayPrice = selectedVariant?.price || product.basePrice;
  const hasVariants = product.variants && product.variants.length > 0;
  const hasImages = product.images && product.images.length > 0;

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
                  <Link href="/catalog" className="text-gray-700 hover:text-[#FFC30C]">Catalog</Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                  </svg>
                  <span className="ml-1 text-gray-500 md:ml-2">{product.name}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Product Section */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 p-4 md:p-6">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {selectedImage ? (
                  <img 
                    src={selectedImage.url} 
                    alt={selectedImage.alt || product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-500">No image available</span>
                  </div>
                )}
              </div>
              
              {/* Thumbnail Gallery */}
              {hasImages && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(image)}
                      className={`aspect-square rounded-md overflow-hidden border-2 ${selectedImage?.id === image.id ? 'border-blue-500' : 'border-transparent'}`}
                    >
                      <img 
                        src={image.url} 
                        alt={image.alt || `${product.name} thumbnail`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Info */}
            <div className="space-y-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>
              
              {/* Price */}
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-semibold text-gray-900">Rp{displayPrice.toLocaleString()}</p>
                {selectedVariant && selectedVariant.price !== product.basePrice && (
                  <p className="text-lg text-gray-500 line-through">Rp{product.basePrice.toLocaleString()}</p>
                )}
              </div>
              
              {/* Variants */}
              {hasVariants && (
                <div className="space-y-3">
                  {/* Color Variants */}
                  {product.variants.some(v => v.color) && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Color</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {Array.from(new Set(product.variants.filter(v => v.color).map(v => v.color))).map(color => (
                          color && (
                            <button
                              key={color}
                              onClick={() => {
                                const variant = product.variants.find(v => v.color === color);
                                if (variant) setSelectedVariant(variant);
                              }}
                              className={`px-3 py-1 text-sm rounded-full border ${selectedVariant?.color === color ? 'border-[#FFC30C] bg-[#FFC30C]/30' : 'border-gray-300'}`}
                            >
                              {color}
                            </button>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Size Variants */}
                  {product.variants.some(v => v.size) && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Size</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {Array.from(new Set(product.variants.filter(v => v.size).map(v => v.size))).map(size => (
                          size && (
                            <button
                              key={size}
                              onClick={() => {
                                const variant = product.variants.find(v => v.size === size);
                                if (variant) setSelectedVariant(variant);
                              }}
                              className={`w-10 h-10 flex items-center justify-center text-sm rounded-md border ${selectedVariant?.size === size ? 'border-[#FFC30C] bg-[#FFC30C]/30': 'border-gray-300'}`}
                            >
                              {size}
                            </button>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Quantity Selector */}
              <div className="flex items-center space-x-4 pt-2">
                <span className="text-sm font-medium text-gray-900">Quantity</span>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={decreaseQuantity}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-x border-gray-300">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Description */}
              <div className="pt-2">
                <p className="text-gray-700">{product.description}</p>
              </div>
              
              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full md:w-auto px-6 py-3 bg-[#FFC30C] text-white rounded-full hover:bg-yellow-500 transition-colors duration-200"
              >
                ADD TO CART
              </button>
            </div>
          </div>
          
          {/* Product Details and Reviews */}
          <div className="border-t border-gray-200 p-4 md:p-6">
            <div className="max-w-3xl mx-auto space-y-8">
              {/* Details Section */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">DETAILS</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>High-quality materials</li>
                  <li>Comfortable fit</li>
                  <li>Machine washable</li>
                  <li>Available in multiple sizes and colors</li>
                </ul>
              </div>
              
              {/* Reviews Section */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">REVIEWS</h2>
                
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {product.reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                        <div className="flex items-center mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i}
                                className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm font-medium text-gray-900">{review.userName}</span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}