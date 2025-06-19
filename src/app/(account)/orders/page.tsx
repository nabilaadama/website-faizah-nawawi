// export default function OrdersPage() {
//   return <h3>Order Page</h3>;
// }

import React from "react";

const orders = [
  {
    id: "1234",
    status: "Dikirim",
    date: "14 Maret 2025",
    contact: {
      name: "Nama",
      phone: "087654321123",
    },
    address: "-",
    payment: "Transfer Bank",
    items: [
      { id: 1, image: "/assets/gambar1.png", name: "Nama Produk", category: "Kategori", price: "Rp.500.000" },
      { id: 2, image: "/assets/gambar1.png", name: "Nama Produk", category: "Kategori", price: "Rp.500.000" },
    ],
  },
  {
    id: "1234",
    status: "Dikirim",
    date: "14 Maret 2025",
    contact: {
      name: "Nama",
      phone: "087654321123",
    },
    address: "-",
    payment: "Transfer Bank",
    items: [
      { id: 1, image: "/assets/gambar1.png", name: "Nama Produk", category: "Kategori", price: "Rp.500.000" },
      { id: 2, image: "/assets/gambar1.png", name: "Nama Produk", category: "Kategori", price: "Rp.500.000" },
      { id: 3, image: "/assets/gambar1.png", name: "Nama Produk", category: "Kategori", price: "Rp.500.000" },
    ],
  },
];

export default function OrderPage() {
  return (
    <div className="p-6 text-black bg-white">
      {orders.map((order, index) => (
        <div key={index} className="border-2 rounded-[16px] p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <div>
              <span className="font-medium">Order ID: {order.id}</span>{" "}
              <span className="text-green-600">{order.status}</span>
              <p className="text-sm">Tanggal: {order.date}</p>
            </div>
            <button className="border border-red-500 text-red-500 px-4 py-1 rounded-full hover:bg-red-50">
              Batalkan Order
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
            <div>
              <p className="font-medium">Info Kontak</p>
              <p>{order.contact.name}</p>
              <p>Nomor Telepon: {order.contact.phone}</p>
            </div>
            <div>
              <p className="font-medium">Alamat</p>
              <p>{order.address}</p>
            </div>
            <div>
              <p className="font-medium">Metode Pembayaran</p>
              <p>{order.payment}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            {order.items.map((item) => (
              <div key={item.id} className="w-[150px]">
                <img src={item.image} alt={item.name} className="w-full h-auto rounded" />
                <p className="text-sm mt-1 font-medium">{item.name}</p>
                <p className="text-xs">{item.category}</p>
                <p className="text-sm">{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

