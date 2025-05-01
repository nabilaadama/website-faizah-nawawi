import Footer from '@/components/footer';
import Header from '@/components/header';

const productdetails = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
        <Header />

      {/* Product Section */}
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Product Image - Left Side */}
            <div className="lg:w-1/2 bg-gray-100 rounded-lg overflow-hidden">
              <div className="aspect-square bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">Product Image</span>
              </div>
            </div>

            {/* Product Info - Right Side */}
            <div className="lg:w-1/2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Nama Produk</h1>
              <p className="text-gray-600 mb-1">Rpxxxxx</p>
              
              <p className="text-gray-700 mt-6 mb-8">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eos voluptate dicta natus, debitis assumenda quaerat nemo. Allas reciendis cupiditate officis laboriosam quisquam nihil vel labore quis nulla, eum tempore in.
              </p>

              <button className="w-full md:w-auto bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-8 rounded-[30px] mb-8 transition duration-200">
                ADD TO CART
              </button>

              {/* Details Accordion */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">DETAILS</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</li>
                  <li>jbkjb</li>
                  <li>bhbbb</li>
                  <li>uhluqigu</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-8">REVIEWS</h2>
            
            <div className="space-y-8">
              {/* Review 1 */}
              <div className="bg-white p-6 rounded-lg shadow-[0_0_12px_0_rgba(0,0,0,0.15)]">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">haloaha</h3>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-gray-600">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                </p>
              </div>

              {/* Review 2 */}
              <div className="bg-white p-6 rounded-lg shadow-[0_0_12px_0_rgba(0,0,0,0.15)]">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">haloaha</h3>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-gray-600">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default productdetails;