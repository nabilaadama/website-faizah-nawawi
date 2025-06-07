"use client";

import React from "react";
import { BadgeCheck, Loader2 } from "lucide-react";

export default function PaymentConfirmation() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Pembayaran</h1>

      <div className="w-full max-w-md border-2 rounded-2xl shadow-sm">
        {/* Header Konfirmasi */}
        <div className="flex items-center gap-2 border-b px-6 py-3">
          <BadgeCheck className="w-4 h-4 text-green-600" />
          <span className="text-sm font-semibold text-black">KONFIRMASI PEMBAYARAN</span>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {/* Nama Penerima */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-black">
              Nama Penerima/Pemilik Rekening
            </label>
            <input
              type="text"
              placeholder="Masukkan Nama Penerima/Pemilik Rekening"
              className="w-full border-2 rounded-md px-3 py-2 text-sm focus:outline-none"
            />
          </div>

          {/* Nomor Invoice & Bank Asal */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1 text-black">Nomor Invoice</label>
              <input
                type="text"
                placeholder="Masukkan Nomor Invoice"
                className="w-full border-2 rounded-md px-3 py-2 text-sm focus:outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1 text-black">Bank Asal</label>
              <input
                type="text"
                placeholder="Masukkan Bank Asal"
                className="w-full border-2 rounded-md px-3 py-2 text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Ditransfer ke */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-black">Ditransfer ke</label>
            <div className="border-2 rounded-md p-3 text-sm space-y-2 text-black">
              <div>BNI - 1234567809 - Faizah Nawawi</div>
              <img src="/assets/bni.png" alt="BNI" className="h-6" />
            </div>
          </div>

          {/* Bukti Transfer */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-black">Bukti Transfer</label>
            <button className="border-2 rounded-md px-4 py-2 text-sm bg-gray-300 hover:bg-gray-400 transition">
              Upload Bukti
            </button>
          </div>

          {/* Status Pembayaran */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-black">Status Pembayaran</label>
            <div className="flex items-center gap-2 text-sm text-yellow-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Diproses</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tombol Konfirmasi */}
      <button className="mt-6 bg-yellow-400 hover:bg-yellow-500 transition px-10 py-2 rounded-2xl font-semibold text-white shadow-md w-full h-[45px] max-w-md">
        Konfirmasi
      </button>
    </div>
  );
}
