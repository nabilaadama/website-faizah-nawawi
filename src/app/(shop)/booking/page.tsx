'use client'; 

import { useState, useEffect } from 'react';
import { addDoc, collection, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase-config';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Head from 'next/head';
import Header from '@/components/header';

export interface Booking {
  id?: string;
  name: string;
  email: string;
  whatsapp: string;
  appointmentDate: string;
  notes?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string | null;
  role: "customer" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

export default function BookingPage() {
  const [formData, setFormData] = useState<Omit<Booking, 'id' | 'status' | 'createdAt' | 'updatedAt'>>({
    name: '',
    email: '',
    whatsapp: '',
    appointmentDate: '',
    notes: ''
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [adminWhatsApp, setAdminWhatsApp] = useState<string | null>(null);
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(true);

  // Admin WhatsApp number - ganti dengan nomor admin yang sebenarnya
  // const ADMIN_WHATSAPP = "628123456789"; // Format: 62 untuk Indonesia tanpa tanda +

  // Fetch admin WhatsApp number from Firestore
  useEffect(() => {
    const fetchAdminWhatsApp = async () => {
      try {
        setIsLoadingAdmin(true);
        const q = query(collection(db, 'users'), where('role', '==', 'admin'));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          // Ambil admin pertama yang ditemukan
          const adminDoc = querySnapshot.docs[0];
          const adminData = adminDoc.data() as User;
          
          if (adminData.phoneNumber) {
            // Format nomor WhatsApp (hapus karakter non-numeric dan tambahkan 62 jika perlu)
            let phoneNumber = adminData.phoneNumber.replace(/\D/g, '');
            if (phoneNumber.startsWith('0')) {
              phoneNumber = '62' + phoneNumber.substring(1);
            } else if (!phoneNumber.startsWith('62')) {
              phoneNumber = '62' + phoneNumber;
            }
            setAdminWhatsApp(phoneNumber);
          } else {
            console.warn('Admin found but no phone number available');
          }
        } else {
          console.warn('No admin user found in database');
        }
      } catch (error) {
        console.error('Error fetching admin WhatsApp:', error);
      } finally {
        setIsLoadingAdmin(false);
      }
    };

    fetchAdminWhatsApp();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      setFormData(prev => ({
        ...prev,
        appointmentDate: date.toISOString()
      }));
    }
  };

  const handleWhatsAppBooking = () => {
    // Check if admin WhatsApp is available
    if (!adminWhatsApp) {
      setSubmitError('Admin WhatsApp number not available. Please try again later or use the regular booking form.');
      return;
    }

    // Validasi form sebelum redirect ke WhatsApp
    if (!formData.name || !formData.email || !formData.whatsapp || !formData.appointmentDate) {
      setSubmitError('Please fill in all required fields before booking via WhatsApp');
      return;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setSubmitError('Please enter a valid email address');
      return;
    }

    // Format tanggal untuk WhatsApp message
    const formattedDate = selectedDate 
      ? selectedDate.toLocaleDateString('id-ID', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      : formData.appointmentDate;

    // Buat pesan WhatsApp
    const message = `Halo! Saya ingin booking appointment dengan Faizah Nawawi.

*Detail Booking:*
Nama: ${formData.name}
Email: ${formData.email}
WhatsApp: ${formData.whatsapp}
Tanggal & Waktu: ${formattedDate}
Catatan: ${formData.notes || 'Tidak ada catatan khusus'}

Mohon konfirmasi ketersediaan jadwal. Terima kasih!`;

    // Encode message untuk URL
    const encodedMessage = encodeURIComponent(message);
    
    // Redirect ke WhatsApp
    const whatsappUrl = `https://wa.me/${adminWhatsApp}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.whatsapp || !formData.appointmentDate) {
      setSubmitError('Please fill in all required fields');
      return;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setSubmitError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const bookingData: Booking = {
        ...formData,
        status: 'pending',
        createdAt: serverTimestamp() as unknown as string,
        updatedAt: serverTimestamp() as unknown as string
      };

      await addDoc(collection(db, 'bookings'), bookingData);
      setSubmitSuccess(true);
      
      setFormData({
        name: '',
        email: '',
        whatsapp: '',
        appointmentDate: '',
        notes: ''
      });
      setSelectedDate(null);

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 8000);
    } catch (error) {
      console.error('Error adding booking: ', error);
      setSubmitError('Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
        <Header />
      <Head>
        <title>Book an Appointment | Faizah Nawawi</title>
        <meta name="description" content="Book a personalized fitting session with Faizah Nawawi" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Personalized Fitting for Your Perfect Look
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Get an exclusive experience with a personal consultation session with Faizah Nawawi to create your dream outfit.
            </p>
          </div>

          <div className="bg-white shadow-[0_0_10px_0_rgba(0,0,0,0.12)] rounded-lg p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {submitSuccess && (
                <div className="rounded-md bg-green-50 p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">
                        Booking submitted successfully! We&apos;ll contact you shortly to confirm your appointment.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {submitError && (
                <div className="rounded-md bg-red-50 p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">{submitError}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="py-3 px-4 block w-full shadow-[0_0_3px_0_rgba(0,0,0,0.12)] focus:ring-yellow-500 focus:border-yellow-500 border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="py-3 px-4 block w-full shadow-[0_0_3px_0_rgba(0,0,0,0.12)] focus:ring-yellow-500 focus:border-yellow-500 border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-2">
                  Whatsapp Number <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    id="whatsapp"
                    name="whatsapp"
                    type="tel"
                    required
                    value={formData.whatsapp}
                    onChange={handleChange}
                    className="py-3 px-4 block w-full shadow-[0_0_3px_0_rgba(0,0,0,0.12)] focus:ring-yellow-500 focus:border-yellow-500 border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Date & Time Plan <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <DatePicker
                    id="appointmentDate"
                    selected={selectedDate}
                    onChange={handleDateChange}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={30}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    minDate={new Date()}
                    className="py-3 px-4 block w-full shadow-[0_0_3px_0_rgba(0,0,0,0.12)] focus:ring-yellow-500 focus:border-yellow-500 border-gray-300 rounded-md"
                    placeholderText="Select date and time"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Notes <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    required
                    value={formData.notes}
                    onChange={handleChange}
                    className="py-3 px-4 block w-full shadow-[0_0_3px_0_rgba(0,0,0,0.12)] focus:ring-yellow-500 focus:border-yellow-500 border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-[#FFC30C] hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFC30C] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
                
                <button
                  type="button"
                  onClick={handleWhatsAppBooking}
                  disabled={isLoadingAdmin || !adminWhatsApp}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  {isLoadingAdmin ? 'Loading...' : 'Booking via WhatsApp'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}