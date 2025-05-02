'use client'

import Image from 'next/image'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="font-sans bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-[#F3F3F3] py-12">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-xl space-y-4">
            <h1 className="text-4xl font-bold text-[#1C1501]">Modest Fashion</h1>
            <p className="text-[#1C1521]">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit...
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-2 mt-4 text-white bg-[#1C1501] hover:bg-black transition rounded-xl shadow-md">
              Jelajahi Sekarang
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 24 24">
                <path d="M10 2a8 8 0 106.32 12.906l4.387 4.387 1.414-1.414-4.387-4.387A8 8 0 0010 2zm0 2a6 6 0 110 12A6 6 0 0110 4z" />
              </svg>
            </button>
          </div>

          <div className="relative mt-10 md:mt-0 w-[300px] h-[400px]">
            <div className="absolute inset-0 bg-yellow-400 rounded-[60px] z-0" />
            <Image
              src="/model.png"
              alt="Model"
              fill
              className="relative z-10 object-cover rounded-[60px]"
            />
            <div className="absolute top-5 right-6 z-20 grid grid-cols-3 gap-1">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="w-1 h-1 bg-black rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Booking & Contact */}
      <section className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-center">
            <div className="p-4 border rounded text-[#1C1501] w-64">🌐 Booking Janji Temu</div>
            <div className="p-4 border rounded text-[#1C1501] w-64">📞 Hubungi Kami</div>
          </div>
        </div>
      </section>

      {/* Koleksi Terbaru */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h2 className="text-2xl font-bold mb-2 text-[#1C1501]">Koleksi Terbaru</h2>
          <p className="text-[#1C1521] mb-10">Ikuti tren dengan pilihan gaya terlaris yang telah kami pilih</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-left w-full">
                <div className="relative rounded-xl overflow-hidden">
                  <Image
                    src="/koleksi1.png"
                    alt={`Koleksi ${i}`}
                    width={400}
                    height={400}
                    className="w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30" />
                </div>
                <div className="mt-4 text-[#1C1501] font-semibold">
                  <div className="flex items-center gap-12">
                    <span>Nama Produk</span>
                    <span className="text-right">Rp xxxx</span>
                  </div>
                </div>
                <p className="text-sm text-[#888]">Kategori</p>
                <div className="text-sm flex items-center gap-1 text-[#F7C100] mt-1">
                  <span>⭐</span>
                  <span className="text-[#888]">xx/xx</span>
                </div>
              </div>
            ))}
          </div>

          <button className="px-6 py-2 border border-yellow-400 text-yellow-500 rounded-full text-sm font-medium inline-flex items-center gap-2 hover:bg-yellow-50 transition">
            Lihat Semua
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z" />
            </svg>
          </button>
        </div>
      </section>

      {/* Produk Kami */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h2 className="text-2xl font-bold text-[#1C1501] mb-6">Produk Kami</h2>

          <div className="flex justify-center gap-8 mb-10 font-semibold text-[#8B8686] text-sm">
            <button className="hover:text-black transition">DISKON</button>
            <button className="text-black relative">
              POPULER
              <span className="block mx-auto mt-1 h-1 w-6 bg-black rounded-full"></span>
            </button>
            <button className="hover:text-black transition">BARANG BARU</button>
            <button className="hover:text-black transition">AKSESORIS</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="text-left">
                <div className="relative rounded-xl overflow-hidden">
                  <Image
                    src="/assets/foto.png"
                    alt={`Produk ${i + 1}`}
                    width={300}
                    height={400}
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30" />
                </div>
                <div className="mt-3 flex items-center justify-start gap-2 text-[#1C1501] font-semibold">
                  <span>Nama Produk</span>
                  <span>Rp xxxx</span>
                </div>
                <p className="text-sm text-[#888]">Kategori</p>
                <div className="text-sm flex items-center gap-12 text-[#F7C100] mt-1">
                  <span>⭐</span>
                  <span className="text-[#888]">xx/xx</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pakaian Desainer */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h2 className="text-2xl font-bold mb-10 text-[#1C1501]">Pakaian Desainer Untuk Anda</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{ src: "/aksesoris.png", title: "Aksesoris" }, { src: "/gaun.png", title: "Gaun" }, { src: "/outerwear.png", title: "Outerwear" }].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="relative rounded-xl overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.title}
                    width={250}
                    height={300}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30" />
                </div>
                <h3 className="text-lg font-semibold mt-4 text-[#1C1501]">{item.title}</h3>
                <p className="text-sm text-[#888888]">Lorem ipsum dolor, sit amet consectetur adipisicing elit.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mengapa Memilih Kami */}
      <section className="bg-[#DDDDDD] py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-yellow-400 inline-block px-4 py-2 rounded-full text-sm font-semibold text-black shadow-sm">
            Mengapa Memilih Kami?
          </div>
          <p className="mt-6 text-[#333333] text-sm leading-relaxed max-w-xl mx-auto text-center">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit...
          </p>
        </div>
      </section>

      {/* Umpan Balik */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-[#1C1501] mb-12">Umpan Balik</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {[{ name: "Andini" }, { name: "Andika" }].map((user, i) => (
              <div key={i} className="bg-[#F7C100] rounded shadow-md p-6 text-left text-[#1C1501]">
                <div className="text-2xl mb-2">❝</div>
                <h3 className="font-semibold mb-2">{user.name}</h3>
                <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <button className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-yellow-500 hover:bg-yellow-100 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>
            <button className="w-8 h-8 rounded-full bg-yellow-400 shadow-md flex items-center justify-center text-black hover:bg-yellow-500 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
