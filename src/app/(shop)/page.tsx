"use client";

import Image from "next/image";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-[#F3F3F3] py-12">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-xl space-y-4">
            <h1 className="text-4xl font-bold text-[#1C1501]">
              Modest Fashion
            </h1>
            <p className="text-[#1C1521]">
            Temukan gaya personal Anda melalui koleksi pilihan yang memancarkan keindahan dan karakter perempuan modern.
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-2 mt-4 text-white bg-[#1C1501] hover:bg-black transition rounded-xl shadow-md">
              Jelajahi Sekarang
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="white"
                viewBox="0 0 24 24"
              >
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
      <div className="p-4 border rounded text-[#1C1501] w-64 flex items-center justify-center gap-2">
        <i className="fas fa-globe text-white"></i>
        🏠︎ Booking Janji Temu
      </div>
      <div className="p-4 border rounded text-[#1C1501] w-64 flex items-center justify-center gap-2">
        <i className="fas fa-phone text-white"></i>
        ☎ Hubungi Kami
      </div>
    </div>
  </div>
</section>

{/* Koleksi Terbaru */}
<section className="bg-white py-12">
  <div className="max-w-7xl mx-auto px-8 text-center">
    <h2 className="text-2xl font-bold mb-2 text-[#1C1501]">Koleksi Terbaru</h2>
    <p className="text-[#1C1521] mb-10">Concept Fashion Phinisi Sunset</p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-left">
      {[
        {
          src: "/images/koleksi_terbaru1.jpg",
          nama: "Gamis Salsabila Aurora",
          harga: "Rp 750.000",
          kategori: "Pernikahan",
          rating: "4.5/5",
        },
        {
          src: "/images/koleksi_terbaru2.jpg",
          nama: "Setelan Nayla Voyage",
          harga: "Rp 520.000",
          kategori: "Formal",
          rating: "4.8/5",
        },
        {
          src: "/images/koleksi_terbaru3.jpg",
          nama: "Tunik Aluna Breeze",
          harga: "Rp 290.000",
          kategori: "Kasual",
          rating: "4.6/5",
        },
      ].map((item, i) => (
        <div key={i} className="w-full bg-white rounded-xl overflow-hidden shadow-md">
          <div className="relative aspect-[4/5] w-full">
            <Image
              src={item.src}
              alt={item.nama}
              fill
              className="object-cover rounded-t-xl"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 rounded-t-xl" />
          </div>
          <div className="p-4 space-y-2">
            <div className="flex justify-between items-center text-[#1C1501] font-semibold">
              <span>{item.nama}</span>
              <span className="text-right text-[#A67C52]">{item.harga}</span>
            </div>
            <p className="text-sm text-[#888]">{item.kategori}</p>
            <div className="flex items-center gap-1 text-sm text-[#888]">
              <span className="text-[#F7C100]">⭐</span>
              <span>{item.rating}</span>
            </div>
          </div>
        </div>
      ))}
    </div>

    <button className="px-6 py-2 border border-yellow-400 text-yellow-500 rounded-full text-sm font-medium inline-flex items-center gap-2 hover:bg-yellow-50 transition">
      Lihat Semua
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z" />
      </svg>
    </button>
  </div>
</section>

{/* Produk Kami */}
<section className="bg-[#F9F9F9] py-12">
  <div className="max-w-7xl mx-auto px-8 text-center">
    <h2 className="text-2xl font-bold text-[#1C1501] mb-2">
      Produk Kami
    </h2>
    <p className="text-[#1C1521] mb-10">Temukan produk pilihan terbaik kami untuk setiap kesempatan</p>

    <div className="flex justify-center gap-8 mb-10 font-semibold text-[#8B8686] text-sm">
      <button className="hover:text-black transition">DISKON</button>
      <button className="text-black relative">
        POPULER
        <span className="block mx-auto mt-1 h-1 w-6 bg-black rounded-full"></span>
      </button>
      <button className="hover:text-black transition">BARANG BARU</button>
      <button className="hover:text-black transition">AKSESORIS</button>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 text-left">
      {[
        {
          src: "/images/produk_kami1.jpeg",
          nama: "Set Kalila Bloom",
          harga: "Rp 680.000",
          kategori: "Tradisional",
          rating: "4.7/5",
        },
        {
          src: "/images/produk_kami2.jpeg",
          nama: "Abaya Nayyara Luxe",
          harga: "Rp 740.000",
          kategori: "Formal",
          rating: "4.8/5",
        },
        {
          src: "/images/produk_kami3.jpeg",
          nama: "Kebaya Nadira Ethnica",
          harga: "Rp 890.000",
          kategori: "Pernikahan",
          rating: "4.9/5",
        },
        {
          src: "/images/produk_kami4.jpeg",
          nama: "Jubah Ungu",
          harga: "Rp 560.000",
          kategori: "Kasual",
          rating: "4.6/5",
        },
        {
          src: "/images/produk_kami5.jpeg",
          nama: "Gaun Polos",
          harga: "Rp 620.000",
          kategori: "Semi Formal",
          rating: "4.5/5",
        },
        {
          src: "/images/produk_kami6.jpeg",
          nama: "Tunik Batik",
          harga: "Rp 430.000",
          kategori: "Batik",
          rating: "4.7/5",
        },
      ].map((item, i) => (
        <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md">
          <div className="relative aspect-[4/5] w-full">
            <Image
              src={item.src}
              alt={item.nama}
              fill
              className="object-cover rounded-t-xl"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 rounded-t-xl" />
          </div>
          <div className="p-4 space-y-2">
            <div className="flex justify-between items-center text-[#1C1501] font-semibold">
              <span>{item.nama}</span>
              <span className="text-[#A67C52]">{item.harga}</span>
            </div>
            <p className="text-sm text-[#888]">{item.kategori}</p>
            <div className="flex items-center gap-1 text-sm text-[#888]">
              <span className="text-[#F7C100]">⭐</span>
              <span>{item.rating}</span>
            </div>
          </div>
        </div>
      ))}
    </div>

    <button className="mt-10 px-6 py-2 border border-yellow-400 text-yellow-500 rounded-full text-sm font-medium inline-flex items-center gap-2 hover:bg-yellow-50 transition">
      Lihat Semua
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z" />
      </svg>
    </button>
  </div>
</section>

{/* Pakaian Desainer */}
<section className="bg-white py-12">
  <div className="max-w-7xl mx-auto px-8 text-center">
    <h2 className="text-2xl font-bold mb-10 text-[#1C1501]">
      Pakaian Desainer Untuk Anda
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        {
          src: "/images/pakaian_desainer1.jpg",
          title: "Gaun",
          description:
            "Gaun elegan dengan potongan modern yang cocok untuk acara formal maupun santai.",
        },
        {
          src: "/images/pakaian_desainer2.jpg",
          title: "Aksesoris",
          description:
            "Aksesoris unik untuk melengkapi gaya anda, mulai dari tas hingga perhiasan mewah.",
        },
        {
          src: "/images/pakaian_desainer3.jpg",
          title: "Pakaian Luar",
          description:
            "Koleksi pakaian luar penuh gaya yang dirancang untuk memberi sentuhan akhir yang sempurna.",
        },
      ].map((item, i) => (
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
          <h3 className="text-lg font-semibold mt-4 text-[#1C1501]">
            {item.title}
          </h3>
          <p className="text-sm text-[#888888]">{item.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* Mengapa Memilih Kami */}
      <section className="bg-[#DDDDDD] py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-yellow-400 inline-block px-4 py-2 rounded-full text-sm font-semibold text-black shadow-sm">
            Mengapa Memilih Kami?
          </div>
          <p className="mt-6 text-[#333333] text-sm leading-relaxed max-w-xl mx-auto">
          Dalam kegiatan usaha kami, kami menerapkan sistem sustainable, dengan menggunakan wastra Sulawesi Selatan, maka secara tidak langsung meningkatkan perekonomian penenun/produsen setempat. Selain itu tenaga kerja kami terdiri dari lulusan SMK dan ibu rumah tangga. Adapun limbah kain dari hasil produksi, kami sortir untuk menyisikan perca yang masih bisa dijadikan produk baru dan yang bisa dihibahkan ke UMKM Kriya sebagai langkah berkontribusi dalam menjaga lingkungan.
          </p>
        </div>
      </section>

      {/* Umpan Balik */}
<section className="bg-white py-16">
  <div className="max-w-6xl mx-auto px-4 text-center">
    <h2 className="text-2xl font-bold text-[#1C1501] mb-12">
      Umpan Balik
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      {/* Testimoni Andini */}
      <div className="bg-[#F7C100] rounded shadow-md p-6 text-left text-[#1C1501]">
        <div className="text-2xl mb-2">❝</div>
        <h3 className="font-semibold mb-2">Andini</h3>
        <p className="text-sm">
          Situs webnya ramah pengguna dan pakaian yang saya pesan sangat pas. Saya sangat puas!
        </p>
      </div>

      {/* Testimoni Andika */}
      <div className="bg-[#F7C100] rounded shadow-md p-6 text-left text-[#1C1501]">
        <div className="text-2xl mb-2">❝</div>
        <h3 className="font-semibold mb-2">Andika</h3>
        <p className="text-sm">
          Desainnya elegan dan kualitas kainnya sangat bagus. Pengiriman juga cepat dan aman.
        </p>
      </div>
    </div>

    <div className="flex justify-center gap-4">
      <button className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-yellow-500 hover:bg-yellow-100 transition">
        ‹
      </button>
      <button className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-yellow-500 hover:bg-yellow-100 transition">
        ›
      </button>
    </div>
  </div>
</section>

      <Footer />
    </main>
  );
}