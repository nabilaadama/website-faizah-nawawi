import { Star } from 'lucide-react';
import Header from "@/components/header";
import HeroCatalog from "@/components/herocatalog";

export default function catalog() {
  return (
    <div>
        <div>
        <Header />
        <HeroCatalog />
        </div>
        
        
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar filters */}
                <div className="w-full md:w-64 shrink-0">
                <div className="mb-8">
                    <h3 className="font-bold text-lg mb-4">Categories</h3>
                    {/* Men's fashion */}
                    <div className="flex items-center mb-2">
                    <input 
                        type="checkbox" 
                        id="category-mens"
                        className="h-4 w-4 border-gray-300 rounded"
                    />
                    <label htmlFor="category-mens" className="ml-2 text-sm text-gray-700">
                        Men's fashion
                    </label>
                    </div>
                    {/* Women's fashion */}
                    <div className="flex items-center mb-2">
                    <input 
                        type="checkbox" 
                        id="category-womens"
                        className="h-4 w-4 border-gray-300 rounded"
                    />
                    <label htmlFor="category-womens" className="ml-2 text-sm text-gray-700">
                        Women's fashion
                    </label>
                    </div>
                    {/* Kids & Toys */}
                    <div className="flex items-center mb-2">
                    <input 
                        type="checkbox" 
                        id="category-kids"
                        className="h-4 w-4 border-gray-300 rounded"
                    />
                    <label htmlFor="category-kids" className="ml-2 text-sm text-gray-700">
                        Kids & Toys
                    </label>
                    </div>
                    {/* Accessories */}
                    <div className="flex items-center mb-2">
                    <input 
                        type="checkbox" 
                        id="category-accessories"
                        className="h-4 w-4 border-gray-300 rounded"
                    />
                    <label htmlFor="category-accessories" className="ml-2 text-sm text-gray-700">
                        Accessories
                    </label>
                    </div>
                    {/* Cosmetics */}
                    <div className="flex items-center mb-2">
                    <input 
                        type="checkbox" 
                        id="category-cosmetics"
                        className="h-4 w-4 border-gray-300 rounded"
                    />
                    <label htmlFor="category-cosmetics" className="ml-2 text-sm text-gray-700">
                        Cosmetics
                    </label>
                    </div>
                    {/* Shoes */}
                    <div className="flex items-center mb-2">
                    <input 
                        type="checkbox" 
                        id="category-shoes"
                        className="h-4 w-4 border-gray-300 rounded"
                    />
                    <label htmlFor="category-shoes" className="ml-2 text-sm text-gray-700">
                        Shoes
                    </label>
                    </div>
                    {/* Sports */}
                    <div className="flex items-center mb-2">
                    <input 
                        type="checkbox" 
                        id="category-sports"
                        className="h-4 w-4 border-gray-300 rounded"
                    />
                    <label htmlFor="category-sports" className="ml-2 text-sm text-gray-700">
                        Sports
                    </label>
                    </div>
                </div>

                <div>
                    <h3 className="font-bold text-lg mb-4">Sort order</h3>
                    {/* Most Popular */}
                    <div className="flex items-center mb-2">
                    <input 
                        type="radio" 
                        id="sort-popular"
                        name="sort"
                        className="h-4 w-4 border-gray-300"
                    />
                    <label htmlFor="sort-popular" className="ml-2 text-sm text-gray-700">
                        Most Popular
                    </label>
                    </div>
                    {/* Best Rating */}
                    <div className="flex items-center mb-2">
                    <input 
                        type="radio" 
                        id="sort-rating"
                        name="sort"
                        className="h-4 w-4 border-gray-300"
                    />
                    <label htmlFor="sort-rating" className="ml-2 text-sm text-gray-700">
                        Best Rating
                    </label>
                    </div>
                    {/* Newest */}
                    <div className="flex items-center mb-2">
                    <input 
                        type="radio" 
                        id="sort-newest"
                        name="sort"
                        className="h-4 w-4 border-gray-300"
                    />
                    <label htmlFor="sort-newest" className="ml-2 text-sm text-gray-700">
                        Newest
                    </label>
                    </div>
                    {/* Price Low - High */}
                    <div className="flex items-center mb-2">
                    <input 
                        type="radio" 
                        id="sort-price-low"
                        name="sort"
                        className="h-4 w-4 border-gray-300"
                    />
                    <label htmlFor="sort-price-low" className="ml-2 text-sm text-gray-700">
                        Price Low - Hight
                    </label>
                    </div>
                    {/* Price High - Low */}
                    <div className="flex items-center mb-2">
                    <input 
                        type="radio" 
                        id="sort-price-high"
                        name="sort"
                        className="h-4 w-4 border-gray-300"
                    />
                    <label htmlFor="sort-price-high" className="ml-2 text-sm text-gray-700">
                        Price Hight - Low
                    </label>
                    </div>
                </div>
                </div>

                {/* Product grid */}
                <div className="flex-grow">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Product Card 1 */}
                    <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <div className="relative h-64 w-full bg-gray-300">
                        <img 
                        src="/api/placeholder/400/320" 
                        alt="Product"
                        className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="p-4">
                        <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-medium text-lg">Nama Produk</h3>
                            <p className="text-sm text-gray-500">Kategori</p>
                            <div className="flex items-center mt-1">
                            <Star size={16} className="text-yellow-400 fill-current" />
                            <span className="text-xs ml-1">xx/xx</span>
                            </div>
                        </div>
                        <p className="font-medium">Rpxxxx</p>
                        </div>
                    </div>
                    </div>

                    {/* Product Card 2 */}
                    <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <div className="relative h-64 w-full bg-gray-300">
                        <img 
                        src="/api/placeholder/400/320" 
                        alt="Product"
                        className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="p-4">
                        <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-medium text-lg">Nama Produk</h3>
                            <p className="text-sm text-gray-500">Kategori</p>
                            <div className="flex items-center mt-1">
                            <Star size={16} className="text-yellow-400 fill-current" />
                            <span className="text-xs ml-1">xx/xx</span>
                            </div>
                        </div>
                        <p className="font-medium">Rpxxxx</p>
                        </div>
                    </div>
                    </div>

                    {/* Product Card 3 */}
                    <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <div className="relative h-64 w-full bg-gray-300">
                        <img 
                        src="/api/placeholder/400/320" 
                        alt="Product"
                        className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="p-4">
                        <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-medium text-lg">Nama Produk</h3>
                            <p className="text-sm text-gray-500">Kategori</p>
                            <div className="flex items-center mt-1">
                            <Star size={16} className="text-yellow-400 fill-current" />
                            <span className="text-xs ml-1">xx/xx</span>
                            </div>
                        </div>
                        <p className="font-medium">Rpxxxx</p>
                        </div>
                    </div>
                    </div>

                    {/* Product Card 4 */}
                    <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <div className="relative h-64 w-full bg-gray-300">
                        <img 
                        src="/api/placeholder/400/320" 
                        alt="Product"
                        className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="p-4">
                        <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-medium text-lg">Nama Produk</h3>
                            <p className="text-sm text-gray-500">Kategori</p>
                            <div className="flex items-center mt-1">
                            <Star size={16} className="text-yellow-400 fill-current" />
                            <span className="text-xs ml-1">xx/xx</span>
                            </div>
                        </div>
                        <p className="font-medium">Rpxxxx</p>
                        </div>
                    </div>
                    </div>

                    {/* Product Card 5 */}
                    <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <div className="relative h-64 w-full bg-gray-300">
                        <img 
                        src="/api/placeholder/400/320" 
                        alt="Product"
                        className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="p-4">
                        <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-medium text-lg">Nama Produk</h3>
                            <p className="text-sm text-gray-500">Kategori</p>
                            <div className="flex items-center mt-1">
                            <Star size={16} className="text-yellow-400 fill-current" />
                            <span className="text-xs ml-1">xx/xx</span>
                            </div>
                        </div>
                        <p className="font-medium">Rpxxxx</p>
                        </div>
                    </div>
                    </div>

                    {/* Product Card 6 */}
                    <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <div className="relative h-64 w-full bg-gray-300">
                        <img 
                        src="/api/placeholder/400/320" 
                        alt="Product"
                        className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="p-4">
                        <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-medium text-lg">Nama Produk</h3>
                            <p className="text-sm text-gray-500">Kategori</p>
                            <div className="flex items-center mt-1">
                            <Star size={16} className="text-yellow-400 fill-current" />
                            <span className="text-xs ml-1">xx/xx</span>
                            </div>
                        </div>
                        <p className="font-medium">Rpxxxx</p>
                        </div>
                    </div>
                    </div>

                    {/* Product Card 7 */}
                    <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <div className="relative h-64 w-full bg-gray-300">
                        <img 
                        src="/api/placeholder/400/320" 
                        alt="Product"
                        className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="p-4">
                        <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-medium text-lg">Nama Produk</h3>
                            <p className="text-sm text-gray-500">Kategori</p>
                            <div className="flex items-center mt-1">
                            <Star size={16} className="text-yellow-400 fill-current" />
                            <span className="text-xs ml-1">xx/xx</span>
                            </div>
                        </div>
                        <p className="font-medium">Rpxxxx</p>
                        </div>
                    </div>
                    </div>

                    {/* Product Card 8 */}
                    <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <div className="relative h-64 w-full bg-gray-300">
                        <img 
                        src="/api/placeholder/400/320" 
                        alt="Product"
                        className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="p-4">
                        <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-medium text-lg">Nama Produk</h3>
                            <p className="text-sm text-gray-500">Kategori</p>
                            <div className="flex items-center mt-1">
                            <Star size={16} className="text-yellow-400 fill-current" />
                            <span className="text-xs ml-1">xx/xx</span>
                            </div>
                        </div>
                        <p className="font-medium">Rpxxxx</p>
                        </div>
                    </div>
                    </div>

                    {/* Product Card 9 */}
                    <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <div className="relative h-64 w-full bg-gray-300">
                        <img 
                        src="/api/placeholder/400/320" 
                        alt="Product"
                        className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="p-4">
                        <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-medium text-lg">Nama Produk</h3>
                            <p className="text-sm text-gray-500">Kategori</p>
                            <div className="flex items-center mt-1">
                            <Star size={16} className="text-yellow-400 fill-current" />
                            <span className="text-xs ml-1">xx/xx</span>
                            </div>
                        </div>
                        <p className="font-medium">Rpxxxx</p>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    </div>
  );
}