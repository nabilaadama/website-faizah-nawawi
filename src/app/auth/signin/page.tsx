export default function Signup() {
    return (
      <div className="flex min-h-screen overflow-hidden">
        {/* Left Side: Form */}
        <div className="w-1/2 flex items-center justify-center bg-gradient-to-b from-gray-100 to-white">
          <div className="w-full max-w-md px-8 py-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Selamat Datang👋🏻</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1 text-gray-800">Email</label>
                <input
                  type="email"
                  placeholder="Masukkan Email"
                  className="w-[422px] h-[45px] text-sm border-2 border-gray-300 rounded-[8px] px-4 py-2 focus:outline-none focus:ring focus:ring-yellow-300"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1 text-gray-800">Password</label>
                <input
                  type="password"
                  placeholder="Masukkan Password"
                  className="w-[422px] h-[45px] text-sm border-2 border-gray-300 rounded-[8px] px-4 py-2 focus:outline-none focus:ring focus:ring-yellow-300"
                />
              </div>
              <button
                type="submit"
                className="w-[422px] h-[45px] bg-yellow-400 text-white py-2 rounded-[18px] font-bold shadow-md hover:bg-yellow-500 transition"
              >
                Sign In
              </button>
            </form>
            <p className="mt-4 text-sm text-center text-gray-800">
              Belum punya akun?{" "}
              <span className="font-medium text-black cursor-pointer hover:underline">
                Sign Up
              </span>
            </p>
          </div>
        </div>
  
        {/* Right Side: Image with overlay */}
        <div className="w-1/2 relative flex items-center justify-center bg-gray-100">
          <img
            src="/assets/signinsignup1.png"
            alt="Fashion Show"
            className="w-full h-full max-h-screen object-cover shadow-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 " />
        </div>
      </div>
    );
  }
  