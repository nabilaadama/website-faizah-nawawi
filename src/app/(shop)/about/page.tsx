// pages/about.tsx
import Header from '@/components/header'
import Footer from '@/components/footer'
import Image from 'next/image'

export default function About() {
  return (
    <main className="bg-white font-sans">
      <Header />

      {/* Hero Section */}
      <section className="bg-yellow-400 py-12">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center gap-10">
          <div className="w-full md:w-1/2">
            <Image
              src="/foto-profile.png"
              alt="Faizah Nawawi"
              width={400}
              height={500}
              className="rounded-lg object-cover mx-auto"
            />
          </div>
          <div className="w-full md:w-1/2 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Faizah Nawawi</h1>
            <p className="text-base leading-relaxed">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eos voluptate dicta natus, debitis assumenda quaerat nemo.
              Alias reiciendis cupiditate officiis laboriosam quisquam nihil vel labore quis nulla, eum tempore in.
            </p>
          </div>
        </div>
      </section>

      {/* Sertifikat & Pendidikan */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-2xl font-bold text-[#1C1501] mb-6">Sertifikat & Pendidikan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[#1C1501]">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <input type="checkbox" className="accent-yellow-500" />
                <span>xxxxxxxxxx</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}