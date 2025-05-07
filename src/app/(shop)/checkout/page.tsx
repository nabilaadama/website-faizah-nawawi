import React from "react";
import { PhoneIcon, MapPinIcon } from "@heroicons/react/24/outline"; // Pastikan install heroicons
import Link from 'next/link';

export default function Checkout() {
  return (
    <div className="min-h-screen bg-white p-6 font-sans flex justify-center">
      {/* Main container with even larger max width */}
      <div className="w-full max-w-screen-xl">
        <h1 className="text-3xl font-bold text-black mt-6 mb-6">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Side - Form */}
          <div className="space-y-8">
            {/* Info Kontak */}
            <div className="border-2 rounded-xl p-6">
              <div className="flex items-center mb-2">
                <PhoneIcon className="w-5 h-5 text-black mr-2" />
                <h2 className="font-regular text-lg text-black">INFO KONTAK</h2>
              </div>
              <hr className="w-full block border-black mb-4" />
              <div className="space-y-4">
                <div>
                  <label className="block text-[15px] font-bold mb-1 text-black">Nama Lengkap</label>
                  <input type="text" placeholder="Masukkan Nama Lengkap" className="w-full h-[45px] text-[15px] px-4 p-2 border-2 rounded-md" />
                </div>
                <div>
                  <label className="block text-[15px] font-bold mb-1 text-black">Nomor Telepon</label>
                  <input type="text" placeholder="Masukkan Nomor Telepon" className="w-full h-[45px] text-[15px] px-4 p-2 border-2 rounded-md" />
                </div>
              </div>
            </div>

            {/* Alamat Pengiriman */}
            <div className="border-2 rounded-xl p-6">
              <div className="flex items-center mb-2">
                <MapPinIcon className="w-5 h-5 text-black mr-2" />
                <h2 className="font-regular text-lg text-black">ALAMAT PENGIRIMAN</h2>
              </div>
              <hr className="w-full block border-black mb-4" />
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[15px] font-bold mb-1 text-black">Kota</label>
                  <input type="text" placeholder="Masukkan Kota" className="w-full h-[45px] text-[15px] px-4 p-2 border-2 rounded-md" />
                </div>
                <div>
                  <label className="block text-[15px] font-bold mb-1 text-black">Provinsi</label>
                  <input type="text" placeholder="Masukkan Provinsi" className="w-full h-[45px] text-[15px] px-4 p-2 border-2 rounded-md" />
                </div>
                <div>
                  <label className="block text-[15px] font-bold mb-1 text-black">Kecamatan</label>
                  <input type="text" placeholder="Masukkan Kecamatan" className="w-full h-[45px] text-[15px] px-4 p-2 border-2 rounded-md" />
                </div>
                <div>
                  <label className="block text-[15px] font-bold mb-1 text-black">Kode Pos</label>
                  <input type="text" placeholder="Masukkan Kode Pos" className="w-full h-[45px] text-[15px] px-4 p-2 border-2 rounded-md" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-[15px] font-bold mb-1 text-black">Alamat</label>
                <input type="text" placeholder="Masukkan Alamat" className="w-full h-[45px] text-[15px] px-4 p-2 border-2 rounded-md" />
              </div>

              {/* Metode Pembayaran */}
              <div className="mb-4">
                <label className="block font-bold mb-1 text-black">Metode Pembayaran</label>
                <div className="border-2 p-4 rounded-md">
                  <p className="italic text-sm mb-2 text-black">Transfer menggunakan rekening a/n Faizah Nawawi.</p>
                  <img src="/assets/bni.png" alt="BNI Logo" className="w-20" />
                </div>
              </div>
              <div>
                <label className="block text-[15px] font-bold mb-1 text-black">Catatan (Optional)</label>
                <input type="text" placeholder="kasi banyak bubble wrapnya kak" className="w-full h-[45px] text-[15px] px-4 p-2 border-2 rounded-md" />
              </div>
            </div>
          </div>

          {/* Right Side - Product Details */}
          <div>
            <h2 className="text-xl font-semibold text-black mb-2">Product Details</h2>
            <hr className="mb-6 border-black" />
            <div className="space-y-6">
              {/* Product 1 */}
              <div className="flex justify-between border-b pb-4">
                <div className="flex gap-4">
                  <img src="/assets/gambar1.png" alt="Product" className="w-28 h-28 object-cover" />
                  <div>
                    <h3 className="font-bold text-[15px] text-black">Nama Produk</h3>
                    <p className="text-sm text-gray-600 text-black">Kategori</p>
                    <p className="text-sm text-gray-600 text-black">Size: S</p>
                    <p className="text-sm text-black">x1</p>
                  </div>
                </div>
                <p className="font-semibold text-black">Rpxxxx</p>
              </div>

              {/* Product 2 */}
              <div className="flex justify-between border-b pb-4">
                <div className="flex gap-4">
                  <img src="/assets/gambar2.png" alt="Product" className="w-28 h-28 object-cover" />
                  <div>
                    <h3 className="font-bold text-[15px] text-black">Nama Produk</h3>
                    <p className="text-sm text-gray-600 text-black">Kategori</p>
                    <p className="text-sm text-gray-600 text-black">Size: S</p>
                    <p className="text-sm text-black">x1</p>
                  </div>
                </div>
                <p className="font-semibold text-black">Rpxxxx</p>
              </div>

              {/* Summary */}
              <div className="flex justify-between mt-4 text-black">
                <p className="text-gray-600 text-black">Subtotal</p>
                <p>Rpxxxx</p>
              </div>
              <div className="flex justify-between font-bold text-lg text-black mb-4">
                <p>Total</p>
                <p>Rpxxxx</p>
              </div>

              <Link
                href="/paymentconfirmation"
                className="block w-full h-[50px] bg-yellow-400 hover:bg-yellow-500 transition text-center py-3 rounded-2xl shadow-md text-white font-semibold"
              >
                Konfirmasi Orderan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}