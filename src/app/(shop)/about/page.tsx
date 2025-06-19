import Header from '@/components/header'
import Footer from '@/components/footer'
import Image from 'next/image'

export default function About() {
  return (
    <main className="bg-white">
      <Header />

      {/* Gambar memanjang di bagian atas */}
      <section className="relative w-full h-[250px]">
        <Image
          src="/images/about_us.jpg"
          alt="About Us"
          layout="fill"
          objectFit="cover"
          priority
        />
      </section>

      {/* About Us dan Paragraf - background kuning */}
      <section className="bg-yellow-400 py-10">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-[#1C1501] mb-6">About Us</h2>
          <p className="text-[#1C1501] text-base leading-relaxed text-justify whitespace-pre-line">
            Brand saya terdiri dari dua suku kata yaitu Faizah dan Nawawi. Faizah berasal dari nama saya sendiri yang artinya kemenangan.  
            Saya berharap brand saya selalu menjadi pemenang di hati konsumen dan calon konsumen saya. Selain itu saya ingin wastra 
            Sulawesi Selatan yang menjadi produk ready to wear ini, bisa menjadi pemenang di negerinya sendiri, seperti batik dan songket. 
            Sedangkan Nawawi adalah nama ayah saya yang tetap disematkan, sebagai ridho orang tua dan juga menjadi penguat nama brand 
            yang kental akan produk fashion muslim.
          </p>
        </div>
      </section>

      {/* Founder Section */}
      <section className="bg-white py-20 border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-start md:items-center gap-10">
          <div className="w-full md:w-1/3 flex justify-center md:justify-start">
            <Image
              src="/images/founder.jpg"
              alt="Founder"
              width={320}
              height={380}
              className="rounded-lg shadow-lg object-cover max-w-[320px]"
            />
          </div>
          <div className="w-full md:w-2/3 text-[#1C1501]">
            <h2 className="text-2xl font-bold mb-4">Founder</h2>
            <p className="text-base leading-relaxed whitespace-pre-line">
              Latar Belakang Pendidikan fashion tahun 2003–2005
              di SMK Neg. 08 Makassar dan melanjutkan pendidikan
              di Universitas Negeri Makassar pada tahun 2005.
              Saat ini saya tergabung dalam Komunitas Desainer
              Olah Tenun dan Alumni Rewako Batch 02 oleh
              Bank Indonesia dan IMUTS Pelatih Indonesia.
            </p>
          </div>
        </div>
      </section>

      {/* Our History Section */}
      <section className="bg-white py-20 border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-start md:items-center gap-10">
          <div className="w-full md:w-1/2 text-[#1C1501]">
            <h2 className="text-2xl font-bold mb-2">Our History</h2>
            <div className="w-24 h-0.5 bg-yellow-400 mb-2" />
            <h3 className="text-sm font-semibold tracking-widest mb-6 text-yellow-500">
              FAIZAH NAWAWI
            </h3>
            <p className="text-base leading-relaxed text-justify whitespace-pre-line">
              Usaha ini didirikan pada tahun 2015 yang didasari oleh rasa cinta terhadap wastra Sulawesi Selatan,
              yang syarat akan makna dan keunikannya tersendiri.

              Dengan bekal pengetahuan di bidang fashion selama bersekolah dahulu, akhirnya memberanikan diri
              untuk memproduksi busana wanita ready to wear yang menghadirkan unsur wastra dan sesuai dengan kaidah
              busana Muslim, di setiap koleksi saya.
            </p>
          </div>
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <Image
              src="/images/our_history.jpg"
              alt="Our History"
              width={280}
              height={420}
              className="rounded-lg shadow-lg object-cover max-w-[280px]"
            />
          </div>
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="bg-gradient-to-b from-gray-100 to-gray-200 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-white p-10 rounded-2xl shadow-xl">
            <h2 className="text-3xl font-bold text-center text-[#1C1501] mb-10">Visi & Misi</h2>

            {/* Visi */}
            <div className="mb-10">
              <h3 className="text-xl font-semibold text-yellow-500 mb-4 text-center">Visi</h3>
              <p className="text-base leading-relaxed text-center text-[#1C1501] max-w-3xl mx-auto">
                Menjadikan wastra Sulawesi Selatan menjadi tuan di negeri sendiri dan dapat dikenal luas hingga manca negara
                dalam perspektif busana wanita modern.
              </p>
            </div>

            {/* Misi */}
            <div>
              <h3 className="text-xl font-semibold text-yellow-500 mb-4 text-center">Misi</h3>
              <p className="text-base leading-relaxed text-center text-[#1C1501] max-w-3xl mx-auto">
                Menjadi brand busana wanita siap pakai yang modern, dengan memperhatikan tren global. Sehingga busana ini tidak
                hanya dikenakan pada acara adat saja, dan dapat meningkatkan kebutuhan bahan baku wastra serta membantu para
                penenun untuk tetap dapat berproduksi.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
