"use client";

import React, { useState, useEffect } from "react";
import { BadgeCheck, Loader2, Upload, X } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc, updateDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase-config';
import { toast } from 'react-hot-toast';
import { Order } from "@/core/entities/order";
import { PaymentDetails } from "@/core/entities/payment-details";
import { BankAccount } from "@/core/entities/bank-account";

interface PaymentFormData {
  senderName: string;
  senderBank: string;
  senderAccountNumber?: string; 
  paymentProofFile: File | null;
}

export default function PaymentConfirmation() {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.orderId as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [activeBankAccount, setActiveBankAccount] = useState<BankAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [formData, setFormData] = useState<PaymentFormData>({
    senderName: '',
    senderBank: '',
    senderAccountNumber: '',
    paymentProofFile: null
  });

  useEffect(() => {
    if (orderId) {
      initializeData();
    } else {
      router.push('/');
    }
  }, [orderId]);

  const initializeData = async () => {
    try {
      await Promise.all([
        fetchOrderData(),
        fetchActiveBankAccount()
      ]);
    } catch (error) {
      console.error('Error initializing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrderData = async () => {
    try {
      const orderDoc = await getDoc(doc(db, 'orders', orderId));
      if (orderDoc.exists()) {
        const orderData = {
          id: orderDoc.id,
          ...orderDoc.data(),
          createdAt: orderDoc.data().createdAt?.toDate() || new Date(),
          updatedAt: orderDoc.data().updatedAt?.toDate() || new Date(),
        } as Order;
        
        setOrder(orderData);
        
        // If payment is already confirmed, redirect
        if (orderData.paymentStatus === 'paid') {
          toast.success('Pembayaran sudah dikonfirmasi');
          router.push('/orders');
        }
      } else {
        toast.error('Order tidak ditemukan');
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Gagal memuat data order');
    }
  };

  const fetchActiveBankAccount = async () => {
    try {
      const bankAccountsRef = collection(db, 'bank-accounts');
      const q = query(bankAccountsRef, where('isActive', '==', true));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const bankAccountDoc = querySnapshot.docs[0];
        const bankAccountData = {
          id: bankAccountDoc.id,
          ...bankAccountDoc.data(),
          createdAt: bankAccountDoc.data().createdAt?.toDate() || new Date(),
          updatedAt: bankAccountDoc.data().updatedAt?.toDate() || new Date(),
        } as BankAccount;
        
        setActiveBankAccount(bankAccountData);
      } else {
        console.error('No active bank account found');
        toast.error('Tidak ada rekening bank aktif');
      }
    } catch (error) {
      console.error('Error fetching bank account:', error);
      toast.error('Gagal memuat data rekening bank');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('File harus berupa gambar (JPG, PNG, WebP)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 5MB');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        paymentProofFile: file
      }));
    }
  };

  const uploadPaymentProof = async (file: File): Promise<string> => {
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${orderId}-${timestamp}.${fileExtension}`;
    
    try {
      // Create FormData to send file to API
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', fileName);
      
      // Call API to save file to public/paymentProof
      const response = await fetch('/api/upload-payment-proof', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const result = await response.json();
      
      // Return the public URL path
      return `/paymentProof/${fileName}`;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Gagal mengupload bukti transfer');
    }
  };

  
  const sendWhatsAppNotification = async (order: Order, paymentDetails: PaymentDetails) => {
    try {
      const adminPhone = '6285225988870'; 
      
      // Format tanggal pembayaran
      const paymentDate = paymentDetails.paymentDate || new Date();
      const formattedDate = paymentDate.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      // Format detail pesanan
      const itemsDetail = order.items.map(item => 
        `${item.productName} : *${item.productName}*
  qty : *${item.quantity}*
  size : *${item.size}*`
      ).join('\n\n');
    
    const message = `*FAKTUR ELEKTRONIK* *TRANSAKSI REGULER*
  Faizah Nawawi Boutique

  Order ID : 
  *${order.orderNumber}*
  Pelanggan Yth : 
  *${order.shippingAddress?.recipientName || paymentDetails.senderName}*
  Terima : *${formattedDate}*

  ======================

  Detail pesanan:
  ${itemsDetail}

  ======================

  Pembayaran:
  Metode : *${paymentDetails.method}*
  Pengirim : *${paymentDetails.senderName}*
  Bank : *${paymentDetails.senderBank}*
  Bukti Transfer : *${paymentDetails.paymentProofUrl}*
  Total : *Rp${order.totalAmount.toLocaleString()}*
  Status: *Menunggu Verifikasi*

  ======================

  Terima kasih`;

      // Encode dengan lebih aman
      const encodedMessage = encodeURIComponent(message);
      
      // Buat URL WhatsApp
      const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodedMessage}`;
      
      console.log('WhatsApp URL:', whatsappUrl);
      console.log('URL Length:', whatsappUrl.length);
      
      // Fungsi untuk membuka WhatsApp dengan delay
      const openWhatsApp = () => {
        // Coba buka di tab baru
        const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        
        if (!newWindow) {
          // Jika popup diblok, coba dengan location
          window.location.href = whatsappUrl;
        }
      };
      
      // Buka WhatsApp setelah delay singkat
      setTimeout(openWhatsApp, 500);
      
      // Tampilkan pesan sukses
      toast.success('Mengarahkan ke WhatsApp...');
      
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      
      // Fallback 1: Buka WhatsApp tanpa pesan
      try {
        const basicUrl = `https://wa.me/6285225988870`;
        window.open(basicUrl, '_blank', 'noopener,noreferrer');
        
        toast('WhatsApp terbuka. Silakan kirim pesan manual tentang pembayaran.');
      } catch (fallbackError) {
        // Fallback 2: Copy pesan dan beri instruksi
        const fallbackMessage = `Order ${order.orderNumber} - Pembayaran Rp${order.totalAmount.toLocaleString()} dari ${paymentDetails.senderName}`;
        
        try {
          navigator.clipboard.writeText(fallbackMessage);
          toast.success('Pesan disalin! Buka WhatsApp manual dan paste pesan ini ke 085225988870');
        } catch (clipError) {
          toast.error('Silakan hubungi admin di 085225988870 secara manual.');
        }
      }
    }
  };

  const handleSubmitPayment = async () => {
    if (!order || !activeBankAccount) return;

    // Validation
    if (!formData.senderName.trim()) {
      toast.error('Nama pengirim harus diisi');
      return;
    }

    if (!formData.senderBank.trim()) {
      toast.error('Bank asal harus diisi');
      return;
    }

    if (!formData.paymentProofFile) {
      toast.error('Bukti transfer harus diupload');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Starting payment confirmation process...');
      
      // Upload payment proof
      console.log('Uploading payment proof...');
      const paymentProofUrl = await uploadPaymentProof(formData.paymentProofFile);
      console.log('Payment proof uploaded:', paymentProofUrl);

      // Create payment details dengan data dari active bank account
      // PERBAIKAN: Hapus field yang undefined, jangan set ke undefined
      const paymentDetails: PaymentDetails = {
        // Data customer yang melakukan pembayaran
        method: 'bank_transfer',
        bankName: activeBankAccount.bankName,
        accountNumber: activeBankAccount.accountNumber,
        accountHolder: activeBankAccount.accountHolder,
        paymentProofUrl: paymentProofUrl,
        senderBank: formData.senderBank,
        senderName: formData.senderName, // Nama pengirim customer
        senderAccountNumber: formData.senderAccountNumber || '', // Pastikan tidak undefined
        paymentDate: new Date(),
        // HAPUS field yang undefined - jangan include sama sekali
        // verifiedBy: undefined,        // HAPUS
        // verificationDate: undefined,  // HAPUS  
        // verificationNotes: undefined, // HAPUS
      };

      console.log('Payment details to save:', paymentDetails);

      // Siapkan data untuk update
      const updatedOrderData = {
        paymentDetails: paymentDetails,
        paymentStatus: 'pending_verification', // Status menunggu verifikasi admin
        status: 'awaiting_payment_verification', // Status order menunggu verifikasi
        updatedAt: serverTimestamp()
      };

      console.log('Updating order in Firestore...');
      console.log('Order ID:', orderId);
      console.log('Update data:', updatedOrderData);

      // Update order dengan error handling yang lebih baik
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, updatedOrderData);
      
      console.log('Order updated successfully');

      // Verifikasi data tersimpan
      const updatedOrderDoc = await getDoc(orderRef);
      if (updatedOrderDoc.exists()) {
        const savedData = updatedOrderDoc.data();
        console.log('Saved order data:', savedData);
        console.log('Saved payment details:', savedData.paymentDetails);
      }

      // Send WhatsApp notification ke admin
      await sendWhatsAppNotification(order, paymentDetails);

      toast.success('Konfirmasi pembayaran berhasil dikirim! Admin akan memverifikasi dalam 1x24 jam.');
      
      // Redirect to success page or orders page
      setTimeout(() => {
        router.push('/orders');
      }, 2000);

    } catch (error) {
      console.error('Error confirming payment:', error);
      
      // Log error detail untuk debugging
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      
      toast.error('Gagal konfirmasi pembayaran. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeFile = () => {
    setFormData(prev => ({
      ...prev,
      paymentProofFile: null
    }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
        <p className="text-gray-600">Memuat data pembayaran...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <p className="text-gray-600 mb-4">Order tidak ditemukan</p>
        <button 
          onClick={() => router.push('/')}
          className="bg-yellow-400 hover:bg-yellow-500 px-6 py-2 rounded-lg text-white font-semibold"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  if (!activeBankAccount) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <p className="text-gray-600 mb-4">Rekening bank tidak tersedia</p>
        <button 
          onClick={() => router.push('/')}
          className="bg-yellow-400 hover:bg-yellow-500 px-6 py-2 rounded-lg text-white font-semibold"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Pembayaran</h1>
      
      {/* Order Summary */}
      <div className="w-full max-w-md mb-6 border-2 rounded-2xl shadow-sm">
        <div className="border-b px-6 py-3">
          <h2 className="font-semibold text-black">Detail Pesanan</h2>
        </div>
        <div className="p-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Nomor Order:</span>
            <span className="font-medium">{order.orderNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Pembayaran:</span>
            <span className="font-bold text-lg text-black">Rp{order.totalAmount.toLocaleString()}</span>
          </div>
          <div className="text-xs text-gray-500">
            Tanggal: {order.createdAt.toLocaleDateString('id-ID')}
          </div>
        </div>
      </div>

      <div className="w-full max-w-md border-2 rounded-2xl shadow-sm">
        {/* Header Konfirmasi */}
        <div className="flex items-center gap-2 border-b px-6 py-3">
          <BadgeCheck className="w-4 h-4 text-green-600" />
          <span className="text-sm font-semibold text-black">KONFIRMASI PEMBAYARAN</span>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {/* Nama Pengirim */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-black">
              Nama Pengirim/Pemilik Rekening
            </label>
            <input
              type="text"
              name="senderName"
              value={formData.senderName}
              onChange={handleInputChange}
              placeholder="Masukkan Nama Pengirim/Pemilik Rekening"
              className="w-full border-2 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
              disabled={isSubmitting}
            />
          </div>

          {/* Nomor Invoice & Bank Asal */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1 text-black">Nomor Invoice</label>
              <input
                type="text"
                value={order.orderNumber}
                readOnly
                className="w-full border-2 rounded-md px-3 py-2 text-sm bg-gray-100 text-gray-600"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1 text-black">Bank Asal</label>
              <input
                type="text"
                name="senderBank"
                value={formData.senderBank}
                onChange={handleInputChange}
                placeholder="Contoh: BCA, Mandiri"
                className="w-full border-2 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Ditransfer ke */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-black">Ditransfer ke</label>
            <div className="border-2 rounded-md p-3 text-sm space-y-2 text-black bg-gray-50">
              <div>{activeBankAccount.bankName} - {activeBankAccount.accountNumber} - {activeBankAccount.accountHolder}</div>
              <img 
                src={`/assets/${activeBankAccount.bankName.toLowerCase()}.png`} 
                alt={activeBankAccount.bankName} 
                className="h-6" 
                onError={(e) => {
                  // Fallback jika gambar tidak ditemukan
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>

          {/* Bukti Transfer */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-black">
              Bukti Transfer
            </label>
            {!formData.paymentProofFile ? (
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="payment-proof"
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="payment-proof"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Klik untuk upload bukti transfer
                  </span>
                  <span className="text-xs text-gray-400">
                    Format: JPG, PNG, WebP (Max 5MB)
                  </span>
                </label>
              </div>
            ) : (
              <div className="border-2 rounded-md p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                    <BadgeCheck className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black">{formData.paymentProofFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(formData.paymentProofFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                {!isSubmitting && (
                  <button
                    onClick={removeFile}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tombol Konfirmasi */}
      <button
        onClick={handleSubmitPayment}
        disabled={isSubmitting || !formData.senderName || !formData.senderBank || !formData.paymentProofFile}
        className={`mt-6 px-10 py-2 rounded-2xl font-semibold shadow-md w-full h-[45px] max-w-md transition-colors ${
          isSubmitting || !formData.senderName || !formData.senderBank || !formData.paymentProofFile
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-yellow-400 hover:bg-yellow-500 text-white'
        }`}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Memproses...</span>
          </div>
        ) : (
          'Konfirmasi Pembayaran'
        )}
      </button>

      {/* Info */}
      <div className="mt-4 max-w-md text-center">
        <p className="text-xs text-gray-500">
          Setelah konfirmasi, admin akan memverifikasi pembayaran Anda dalam 1x24 jam.
          Notifikasi akan dikirim melalui WhatsApp.
        </p>
      </div>
    </div>
  );
}