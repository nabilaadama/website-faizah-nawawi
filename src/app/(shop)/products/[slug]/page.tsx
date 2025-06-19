"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase-config';
import { Product, ProductImage, ProductVariant, Category, Review } from '@/core/entities/product';
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Star, Info, ShoppingCart, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-hot-toast';

interface ProductWithDetails extends Product {
  variants?: ProductVariant[];
  category?: Category;
  reviews?: Review[];
}

export default function ProductDetails() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const [product, setProduct] = useState<ProductWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  const { addToCart, user } = useCart();

  const ADMIN_WHATSAPP = "6281234567890";

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        if (!slug) {
          setError("Product slug is missing");
          return;
        }

        const productsRef = collection(db, "products");
        const slugQuery = query(productsRef, where("slug", "==", slug));
        const slugSnapshot = await getDocs(slugQuery);
        
        let productData: ProductWithDetails | null = null;
        
        if (!slugSnapshot.empty) {
          const doc = slugSnapshot.docs[0];
          productData = await getProductWithDetails(doc);
        } else {
          const docRef = doc(db, "products", slug);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            productData = await getProductWithDetails(docSnap);
          }
        }

        if (productData) {
          setProduct(productData);
          const primaryImage = productData.images?.find(img => img.isPrimary);
          setSelectedImage(primaryImage || productData.images?.[0] || null);
          
          if (productData.variants && productData.variants.length > 0) {
            setSelectedVariant(productData.variants[0]);
          }
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    

    const getProductWithDetails = async (docSnap: any): Promise<ProductWithDetails> => {
      const data = docSnap.data();
      
      let variants: ProductVariant[] = [];
      const variantsQuery = query(collection(db, "productVariants"), where("productId", "==", docSnap.id));
      const variantsSnapshot = await getDocs(variantsQuery);
      variants = variantsSnapshot.docs.map(variantDoc => ({
        id: variantDoc.id,
        productId: variantDoc.data().productId,
        size: variantDoc.data().size,
        color: variantDoc.data().color,
        price: variantDoc.data().price,
        stock: variantDoc.data().stock,
        createdAt: variantDoc.data().createdAt?.toDate() || new Date(),
        updatedAt: variantDoc.data().updatedAt?.toDate() || new Date(),
      }));
      
      // Fetch category details
      let category: Category | undefined;
      if (data.categoryId) {
        const categoryDoc = await getDoc(doc(db, "categories", data.categoryId));
        if (categoryDoc.exists()) {
          const categoryData = categoryDoc.data();
          category = {
            id: categoryDoc.id,
            name: categoryData.name,
            slug: categoryData.slug,
            createdAt: categoryData.createdAt?.toDate() || new Date(),
            updatedAt: categoryData.updatedAt?.toDate() || new Date(),
          };
        }
      }
      
      // Fetch approved reviews
      let reviews: Review[] = [];
      const reviewsQuery = query(
        collection(db, "reviews"), 
        where("productId", "==", docSnap.id),
        where("status", "==", "approved")
      );
      const reviewsSnapshot = await getDocs(reviewsQuery);
      reviews = reviewsSnapshot.docs.map(reviewDoc => ({
        id: reviewDoc.id,
        productId: reviewDoc.data().productId,
        userId: reviewDoc.data().userId,
        userName: reviewDoc.data().userName,
        rating: reviewDoc.data().rating,
        comment: reviewDoc.data().comment,
        status: reviewDoc.data().status,
        createdAt: reviewDoc.data().createdAt?.toDate() || new Date(),
        updatedAt: reviewDoc.data().updatedAt?.toDate() || new Date(),
      }));
      
      return {
        id: docSnap.id,
        name: data.name,
        slug: data.slug,
        description: data.description,
        basePrice: data.basePrice,
        stock: data.stock,
        categoryId: data.categoryId,
        categoryName: data.categoryName,
        images: data.images || [],
        variants: variants,
        featured: data.featured || false,
        available: data.available !== undefined ? data.available : true,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        reviews: reviews,
        category: category
      };
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product || isAddingToCart) return;
    
    setIsAddingToCart(true);
    
    try {
      const price = selectedVariant?.price || product.basePrice;
      const stock = selectedVariant?.stock || product.stock;
      
      if (quantity > stock) {
        toast.error(`Only ${stock} items available in stock`, {
          position: 'bottom-right',
          duration: 3000,
        });
        return;
      }

      const cartItem = {
        productId: product.id,
        variantId: selectedVariant?.id,
        name: product.name,
        price: price,
        image: selectedImage?.url || product.images[0]?.url || '',
        quantity: quantity,
        variantDetails: selectedVariant ? `${selectedVariant.color}, ${selectedVariant.size}` : undefined
      };

      await addToCart(cartItem);

      toast.success(`${product.name} added to cart!`, {
        position: 'bottom-right',
        duration: 3000,
      });
    } catch (err) {
      console.error('Error adding to cart:', err);
      
      let errorMessage = 'Failed to add item to cart. Please try again.';
      
      if (err instanceof Error) {
        if (err.message.includes('logged in')) {
          errorMessage = 'Please login to add items to cart';
          router.push(`/login?redirect=/products/${slug}`);
        }
      }

      toast.error(errorMessage, {
        position: 'bottom-right',
        duration: 3000,
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const increaseQuantity = () => {
    const maxStock = selectedVariant?.stock || product?.stock || 1;
    if (quantity < maxStock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setQuantity(1);
  };

  const averageRating = product?.reviews && product.reviews.length > 0 
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length 
    : 0;

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
              href="/products"
              className="mt-4 px-4 py-2 bg-[#FFC30C]text-white rounded-md hover:bg-yellow-500 inline-block"
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
              href="/products"
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

  const handleWhatsAppOrder = () => {
    if (!product) return;

    const price = selectedVariant?.price || product.basePrice;
    const totalPrice = price * quantity;
    
    let message = `Halo, saya ingin memesan produk berikut:\n\n`;
    message += `*Nama Produk:* ${product.name}\n`;
    message += `*Harga:* Rp${price.toLocaleString()}\n`;
    message += `*Jumlah:* ${quantity}\n`;
    
    if (selectedVariant) {
      if (selectedVariant.color) message += `*Warna:* ${selectedVariant.color}\n`;
      if (selectedVariant.size) message += `*Ukuran:* ${selectedVariant.size}\n`;
    }
    
    message += `*Total:* Rp${totalPrice.toLocaleString()}\n\n`;
    message += `Terima kasih!`;

    const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const displayPrice = selectedVariant?.price || product.basePrice;
  const displayStock = selectedVariant?.stock || product.stock;
  const hasImages = product.images && product.images.length > 0;
  const hasVariants = product.variants && product.variants.length > 0;
  const isAvailable = product.available && displayStock > 0;

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
                  <Link href="/products" className="text-gray-700 hover:text-[#FFC30C]">Catalog</Link>
                </div>
              </li>
              {product.category && (
                <li>
                  <div className="flex items-center">
                    <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                    </svg>
                    <Link href={`/categories/${product.category.slug}`} className="text-gray-700 hover:text-[#FFC30C]">
                      {product.category.name}
                    </Link>
                  </div>
                </li>
              )}
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
        <div className="bg-white rounded-lg overflow-hidden">
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
                  {product.images.map((image, index) => (
                    <button
                      key={image.id || `${image.url}-${index}`}
                      onClick={() => setSelectedImage(image)}
                      className={`aspect-square rounded-md overflow-hidden border-2 ${selectedImage?.url === image.url ? 'border-blue-500' : 'border-transparent'}`}
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
              
              {/* Category and Rating */}
              <div className="flex flex-col space-y-2">
                {product.category && (
                  <div className="text-sm text-gray-500">
                    Category: <Link href={`/categories/${product.category.slug}`} className="text-blue-600 hover:underline">
                      {product.category.name}
                    </Link>
                  </div>
                )}
                
                {/* Rating Display */}
                {product.reviews && product.reviews.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={`w-4 h-4 ${i < Math.round(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {averageRating.toFixed(1)} ({product.reviews.length} review{product.reviews.length !== 1 ? 's' : ''})
                    </span>
                  </div>
                )}
              </div>
              
              {/* Stock Status */}
              <div className={`text-sm font-medium ${isAvailable ? 'text-green-600' : 'text-red-500'}`}>
                {isAvailable ? `In Stock (${displayStock} available)` : 'Out of Stock'}
              </div>
              
              {/* Price */}
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-semibold text-gray-900">Rp{displayPrice.toLocaleString()}</p>
                {selectedVariant && selectedVariant.price !== product.basePrice && (
                  <p className="text-lg text-gray-500 line-through">Rp{product.basePrice.toLocaleString()}</p>
                )}
              </div>

              {/* Variant Selection */}
              {hasVariants && (
                <div className="space-y-4 pt-2">
                  {/* Color Variants */}
                  {product.variants?.some(v => v.color) && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Color</h3>
                      <div className="flex flex-wrap gap-2">
                        {Array.from(new Set(product.variants?.map(v => v.color))).map(color => { 
                          const colorVariants = product.variants?.filter(v => v.color === color);
                          const hasStock = colorVariants?.some(v => v.stock > 0);
                          
                          return (
                            <button
                              key={color}
                              onClick={() => {
                                // Find the best variant for this color
                                let variant;
                                
                                if (selectedVariant?.size) {
                                  variant = product.variants?.find(v => 
                                    v.color === color && v.size === selectedVariant.size
                                  );
                                }
                                
                                if (!variant) {
                                  variant = product.variants?.find(v => 
                                    v.color === color && v.stock > 0
                                  );
                                }
                                
                                if (!variant) {
                                  variant = product.variants?.find(v => v.color === color);
                                }
                                
                                if (variant) {
                                  handleVariantSelect(variant);
                                }
                              }}
                              disabled={!hasStock}
                              className={`px-3 py-1 border rounded-md text-sm transition-colors ${
                                selectedVariant?.color === color 
                                  ? 'border-[#FFC30C] bg-[#FFC30C] text-white' 
                                  : hasStock
                                  ? 'border-[#FFC30C] hover:bg-[#FFC30C]/10 text-yellow-700'
                                  : 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              {color}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* Size Variants */}
                  {product.variants?.some(v => v.size) && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Size</h3>
                      <div className="flex flex-wrap gap-2">
                        {Array.from(new Set(product.variants.map(v => v.size))).map(size => {
                          const sizeVariants = product.variants?.filter(v => v.size === size);
                          const hasStock = sizeVariants?.some(v => v.stock > 0);
                          
                          return (
                            <button
                              key={size}
                              onClick={() => {
                                // Find the best variant for this size
                                let variant;
                                
                                if (selectedVariant?.color) {
                                  variant = product.variants?.find(v => 
                                    v.size === size && v.color === selectedVariant.color
                                  );
                                }
                                
                                if (!variant) {
                                  variant = product.variants?.find(v => 
                                    v.size === size && v.stock > 0
                                  );
                                }
                                
                                if (!variant) {
                                  variant = product.variants?.find(v => v.size === size);
                                }
                                
                                if (variant) {
                                  handleVariantSelect(variant);
                                }
                              }}
                              disabled={!hasStock}
                              className={`px-3 py-1 border rounded-md text-sm transition-colors ${
                                selectedVariant?.size === size 
                                  ? 'border-[#FFC30C] bg-[#FFC30C] text-white' 
                                  : hasStock
                                  ? 'border-[#FFC30C] hover:bg-[#FFC30C]/10 text-yellow-700'
                                  : 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              {size}
                            </button>
                          );
                        })}
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
                    disabled={quantity <= 1}
                    className={`px-3 py-1 ${quantity <= 1 ? 'text-gray-400' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-x border-gray-300">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    disabled={quantity >= displayStock}
                    className={`px-3 py-1 ${quantity >= displayStock ? 'text-gray-400' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  Max: {displayStock}
                </span>
              </div>
              
              {/* Description */}
              <div className="pt-2">
                <h3 className="text-sm font-medium text-gray-900 mb-1">Description</h3>
                <p className="text-gray-700">{product.description}</p>
              </div>
              

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || !isAvailable || !user}
                    className={`
                      w-full py-3.5 px-3 rounded-full font-medium text-xs transition-all duration-200
                      flex items-center justify-center gap-1.5
                      ${isAddingToCart || !isAvailable || !user
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-[#FFC30C] hover:bg-yellow-500 text-white shadow-md hover:shadow-lg'
                      }
                    `}
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span className="truncate">
                      {isAddingToCart ? (
                        'ADDING...'
                      ) : !isAvailable ? (
                        'OUT OF STOCK'
                      ) : !user ? (
                        'LOGIN TO ADD TO CART'
                      ) : (
                        'ADD TO CART'
                      )}
                    </span>
                  </button>

                  {/* WhatsApp Button */}
                  <button
                    onClick={handleWhatsAppOrder}
                    className="
                      w-full py-3.5 px-5 rounded-full font-medium text-xs
                      bg-green-500 hover:bg-green-600 text-white
                      transition-all duration-200 shadow-md hover:shadow-lg
                      flex items-center justify-center gap-1.5
                      sm:col-span-2 lg:col-span-1
                    "
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span className="truncate">BELI LEWAT WHATSAPP</span>
                  </button>
                </div>
                {!user && (
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <Info className="w-4 h-4 mr-1" />
                      <span>You need to login to add items to your cart</span>
                    </div>
                  )}
              </div>   
            </div>
          </div>
          
          {/* Product Details and Reviews */}
          <div className="border-t border-gray-200 p-4 md:p-6">
            <div className="max-w-3xl mx-auto space-y-8">
              
              {/* Reviews Section */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">CUSTOMER REVIEWS</h2>
                
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {/* Review Summary */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i}
                              className={`w-5 h-5 ${i < Math.round(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-lg font-medium">{averageRating.toFixed(1)} out of 5</span>
                        <span className="text-gray-600">({product.reviews.length} review{product.reviews.length !== 1 ? 's' : ''})</span>
                      </div>
                    </div>
                    
                    {/* Individual Reviews */}
                    {product.reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i}
                                  className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            <span className="font-medium text-gray-900">{review.userName || 'Anonymous'}</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {review.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-gray-700">{review.comment}</p>
                        )}
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