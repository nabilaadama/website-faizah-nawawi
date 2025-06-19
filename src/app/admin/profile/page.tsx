import React from 'react';

const AdminProfilePage = () => {
  return (
    <div className="bg-gray-100 w-full h-full overflow-y-auto">
      <div className="max-w-4xl ml-auto mr-[12%] p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-10 pt-4 mt-10">
          Admin Profile Page
        </h1>

        <form className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-bold text-gray-700">
              Nama Lengkap
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Masukkan Nama Lengkap"
              className="h-[45px] text-black text-sm mt-1 block w-full px-5 py-3 border-2 border-gray-300 rounded-[8px] shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-bold text-gray-700">
              Alamat Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Masukkan Email"
              className="h-[45px] text-black text-sm mt-1 block w-full px-5 py-3 border-2 border-gray-300 rounded-[8px] shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="currentPassword" className="block text-sm font-bold text-gray-700">
              Password Saat Ini
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              placeholder="Masukkan Password Saat Ini"
              className="h-[45px] text-black text-sm mt-1 block w-full px-5 py-3 border-2 border-gray-300 rounded-[8px] shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-bold text-gray-700">
              Password Baru
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              placeholder="Masukkan Password Baru"
              className="h-[45px] text-black text-sm mt-1 block w-full px-5 py-3 border-2 border-gray-300 rounded-[8px] shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700">
              Konfirmasi Password Baru
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Konfirmasi Password Baru"
              className="h-[45px] text-black text-sm mt-1 block w-full px-5 py-3 border-2 border-gray-300 rounded-[8px] shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="pb-8">
            <button
              type="submit"
              className="w-full h-[45px] flex justify-center py-3 px-4 text-sm font-bold shadow-md text-white bg-yellow-400 rounded-[18px] hover:bg-yellow-500 transition"
            >
              Perbarui Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProfilePage;