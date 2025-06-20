"use client";

import React, { useState, useEffect } from "react";
import { BadgeCheck, Loader2, Upload, X, AlertTriangle } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc, updateDoc, serverTimestamp, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
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
  const [activeBankAccounts, setActiveBankAccounts] = useState<BankAccount[]>([]);
  const [selectedBankAccount, setSelectedBankAccount] = useState<BankAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
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
        fetchActiveBankAccounts()
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
        
        if (orderData.paymentStatus === 'paid' || orderData.paymentStatus === 'payment_verification') {
          toast.success('Payment has been confirmed');
          router.push('/orders');
        }
      } else {
        toast.error('Order not found');
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order data');
    }
  };

  const fetchActiveBankAccounts = async () => {
    try {
      const bankAccountsRef = collection(db, 'bank-accounts');
      const q = query(bankAccountsRef, where('isActive', '==', true));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const bankAccounts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as BankAccount[];
        
        setActiveBankAccounts(bankAccounts);
        // Set first bank account as default selection
        if (bankAccounts.length > 0) {
          setSelectedBankAccount(bankAccounts[0]);
        }
      } else {
        console.error('No active bank accounts found');
        toast.error('No active bank accounts available');
      }
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
      toast.error('Failed to load bank account data');
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
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('File must be an image (JPG, PNG, WebP)');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Maximum file size is 5MB');
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
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', fileName);
      
      const response = await fetch('/api/upload-payment-proof', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const result = await response.json();
      
      return `/paymentProof/${fileName}`;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload payment proof');
    }
  };

  const sendWhatsAppNotification = async (order: Order, paymentDetails: PaymentDetails) => {
    try {
      const adminPhone = '6285225988870'; 
      
      const message = `Hello admin, I have made an order with order number ${order.orderNumber}`;

      const encodedMessage = encodeURIComponent(message);
      
      const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodedMessage}`;
      
      console.log('WhatsApp URL to admin:', whatsappUrl);
      
      const openWhatsApp = () => {
        const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        
        if (!newWindow) {
          window.location.href = whatsappUrl;
        }
      };
      
      setTimeout(openWhatsApp, 500);
      
      toast.success('Redirecting to WhatsApp for admin confirmation...');
      
    } catch (error) {
      console.error('Error opening WhatsApp:', error);

      try {
        const adminPhone = '6285225988870';
        const basicUrl = `https://wa.me/${adminPhone}`;
        window.open(basicUrl, '_blank', 'noopener,noreferrer');
        
        toast('WhatsApp opened. Please send manual message to admin.');
      } catch (fallbackError) {

        const fallbackMessage = `Hello admin, I have made an order with order number ${order.orderNumber}`;
        
        try {
          navigator.clipboard.writeText(fallbackMessage);
          toast.success('Message copied! Open WhatsApp manually and send to admin.');
        } catch (clipError) {
          toast.error('Please contact admin manually.');
        }
      }
    }
  };

  const handleSubmitPayment = async () => {
    if (!order || !selectedBankAccount) return;

    // Validation
    if (!formData.senderName.trim()) {
      toast.error('Sender name is required');
      return;
    }

    if (!formData.senderBank.trim()) {
      toast.error('Sender bank is required');
      return;
    }

    if (!formData.paymentProofFile) {
      toast.error('Payment proof must be uploaded');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Starting payment confirmation process...');
      
      console.log('Uploading payment proof...');
      const paymentProofUrl = await uploadPaymentProof(formData.paymentProofFile);
      console.log('Payment proof uploaded:', paymentProofUrl);

      const paymentDetails: PaymentDetails = {
        method: 'bank_transfer',
        bankName: selectedBankAccount.bankName,
        accountNumber: selectedBankAccount.accountNumber,
        accountHolder: selectedBankAccount.accountHolder,
        paymentProofUrl: paymentProofUrl,
        senderBank: formData.senderBank,
        senderName: formData.senderName, 
        senderAccountNumber: formData.senderAccountNumber || '', 
        paymentDate: new Date(),
      };

      console.log('Payment details to save:', paymentDetails);

      const updatedOrderData = {
        paymentDetails: paymentDetails,
        paymentStatus: 'Payment Verfication', 
        status: 'pending', 
        updatedAt: serverTimestamp()
      };

      console.log('Updating order in Firestore...');
      console.log('Order ID:', orderId);
      console.log('Update data:', updatedOrderData);

      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, updatedOrderData);
      
      console.log('Order updated successfully');

      const updatedOrderDoc = await getDoc(orderRef);
      if (updatedOrderDoc.exists()) {
        const savedData = updatedOrderDoc.data();
        console.log('Saved order data:', savedData);
        console.log('Saved payment details:', savedData.paymentDetails);
      }

      await sendWhatsAppNotification(order, paymentDetails);

      toast.success('Payment confirmation sent successfully! Admin will verify within 24 hours.');
      
      setTimeout(() => {
        router.push('/orders');
      }, 2000);

    } catch (error) {
      console.error('Error confirming payment:', error);
      
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      
      toast.error('Failed to confirm payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelPayment = async () => {
    if (!order) return;

    setIsCancelling(true);

    try {
      await deleteDoc(doc(db, 'orders', orderId));
      
      toast.success('Payment cancelled successfully');
      
      setTimeout(() => {
        router.push('/products');
      }, 1000);

    } catch (error) {
      console.error('Error cancelling payment:', error);
      toast.error('Failed to cancel payment. Please try again.');
    } finally {
      setIsCancelling(false);
      setShowCancelConfirm(false);
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
        <p className="text-gray-600">Loading payment data...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <p className="text-gray-600 mb-4">Order not found</p>
        <button 
          onClick={() => router.push('/')}
          className="bg-yellow-400 hover:bg-yellow-500 px-6 py-2 rounded-lg text-white font-semibold"
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (!activeBankAccounts.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <p className="text-gray-600 mb-4">No bank accounts available</p>
        <button 
          onClick={() => router.push('/')}
          className="bg-yellow-400 hover:bg-yellow-500 px-6 py-2 rounded-lg text-white font-semibold"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Payment</h1>
      
      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8 items-center justify-center text-center">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-semibold text-black">Cancel Payment</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this payment? This action cannot be undone and your order will be deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                disabled={isCancelling}
              >
                Keep Payment
              </button>
              <button
                onClick={handleCancelPayment}
                disabled={isCancelling}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium disabled:opacity-50"
              >
                {isCancelling ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Cancelling...</span>
                  </div>
                ) : (
                  'Yes, Cancel'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Order Summary */}
      <div className="w-full max-w-md mb-6 border-2 rounded-2xl shadow-sm">
        <div className="border-b px-6 py-3">
          <h2 className="font-semibold text-black">Order Details</h2>
        </div>
        <div className="p-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Order Number:</span>
            <span className="font-medium">{order.orderNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Payment:</span>
            <span className="font-bold text-lg text-black">Rp{order.totalAmount.toLocaleString()}</span>
          </div>
          <div className="text-xs text-gray-500">
            Date: {order.createdAt.toLocaleDateString('en-US')}
          </div>
        </div>
      </div>

      <div className="w-full max-w-md border-2 rounded-2xl shadow-sm">
        {/* Confirmation Header */}
        <div className="flex items-center gap-2 border-b px-6 py-3">
          <BadgeCheck className="w-4 h-4 text-green-600" />
          <span className="text-sm font-semibold text-black">PAYMENT CONFIRMATION</span>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {/* Sender Name */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-black">
              Sender Name/Account Holder
            </label>
            <input
              type="text"
              name="senderName"
              value={formData.senderName}
              onChange={handleInputChange}
              placeholder="Enter Sender Name/Account Holder"
              className="w-full border-2 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
              disabled={isSubmitting}
            />
          </div>

          {/* Invoice Number & Sender Bank */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1 text-black">Invoice Number</label>
              <input
                type="text"
                value={order.orderNumber}
                readOnly
                className="w-full border-2 rounded-md px-3 py-2 text-sm bg-gray-100 text-gray-600"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1 text-black">Sender Bank</label>
              <input
                type="text"
                name="senderBank"
                value={formData.senderBank}
                onChange={handleInputChange}
                placeholder="e.g: BCA, Mandiri"
                className="w-full border-2 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Transfer To - Bank Selection */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-black">Transfer To</label>
            <div className="space-y-2">
              {activeBankAccounts.map((bankAccount) => (
                <label
                  key={bankAccount.id}
                  className={`flex items-center p-3 border-2 rounded-md cursor-pointer transition-colors ${
                    selectedBankAccount?.id === bankAccount.id
                      ? 'border-yellow-400 bg-yellow-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="bankAccount"
                    value={bankAccount.id}
                    checked={selectedBankAccount?.id === bankAccount.id}
                    onChange={() => setSelectedBankAccount(bankAccount)}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between w-full">
                    <div className="flex-1">
                      <div className="font-medium text-black">{bankAccount.bankName}</div>
                      <div className="text-sm text-gray-600">{bankAccount.accountNumber}</div>
                      <div className="text-sm text-gray-600">{bankAccount.accountHolder}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <img 
                        src={`/assets/${bankAccount.bankName.toLowerCase()}.png`} 
                        alt={bankAccount.bankName} 
                        className="h-6" 
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        selectedBankAccount?.id === bankAccount.id
                          ? 'border-yellow-400 bg-yellow-400'
                          : 'border-gray-300'
                      }`}>
                        {selectedBankAccount?.id === bankAccount.id && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Payment Proof */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-black">
              Payment Proof
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
                    Click to upload payment proof
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

      {/* Action Buttons */}
      <div className="mt-6 w-full max-w-md space-y-3">
        <button
          onClick={handleSubmitPayment}
          disabled={isSubmitting || !formData.senderName || !formData.senderBank || !formData.paymentProofFile}
          className={`px-10 py-2 rounded-2xl font-semibold shadow-md w-full h-[45px] transition-colors ${
            isSubmitting || !formData.senderName || !formData.senderBank || !formData.paymentProofFile
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-yellow-400 hover:bg-yellow-500 text-white'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            'Confirm Payment'
          )}
        </button>

        <button
          onClick={() => setShowCancelConfirm(true)}
          disabled={isSubmitting || isCancelling}
          className="px-10 py-2 rounded-2xl font-semibold shadow-md w-full h-[45px] border border-red-500 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel Payment
        </button>
      </div>

      {/* Info */}
      <div className="mt-4 max-w-md text-center">
        <p className="text-xs text-gray-500">
          After confirmation, admin will verify your payment within 24 hours.
          Notification will be sent via WhatsApp.
        </p>
      </div>
    </div>
  );
}