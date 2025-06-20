"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { MessageCircle, Eye, ExternalLink, X } from 'lucide-react';
import { collection, doc, updateDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase-config'; 
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from 'material-react-table';
import { Box, MenuItem, Select, FormControl, IconButton, Tooltip } from '@mui/material';
import Image from 'next/image';

type OrderItem = {
  productImage: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
};

type ShippingAddress = {
  recipientName: string;
  phoneNumber: string;
  fullAddress: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
  notes?: string;
};

type PaymentDetails = {
  method?: string;
  bankName?: string;
  accountNumber?: string;
  senderName?: string;
  paymentProofUrl?: string;
};

type Order = {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  totalAmount: number;
  subtotal: number;
  status: string;
  paymentStatus: string;
  paymentDetails?: PaymentDetails;
  createdAt: Date;
  updatedAt: Date;
};

const OrderPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [updating, setUpdating] = useState<{ [key: string]: boolean }>({});

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: '#6b7280' },
    { value: 'processing', label: 'Processing', color: '#3b82f6' },
    { value: 'shipped', label: 'Shipped', color: '#8b5cf6' },
    { value: 'delivered', label: 'Delivered', color: '#10b981' },
    { value: 'cancelled', label: 'Cancelled', color: '#ef4444' },
    { value: 'refunded', label: 'Refunded', color: '#f59e0b' }
  ];

  const paymentStatusOptions = [
    { value: 'payment_verification', label: 'Payment Verification', color: '#eab308' },
    { value: 'paid', label: 'Paid', color: '#10b981' },
    { value: 'unpaid', label: 'Unpaid', color: '#ef4444' },
    { value: 'refunded', label: 'Refunded', color: '#f59e0b' }
  ];

  useEffect(() => {
    const fetchOrders = () => {
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, orderBy('createdAt', 'desc'));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const ordersData: Order[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            orderNumber: data.orderNumber || '',
            items: data.items || [],
            shippingAddress: data.shippingAddress || {
              recipientName: '',
              phoneNumber: '',
              fullAddress: '',
              district: '',
              city: '',
              province: '',
              postalCode: '',
              notes: ''
            },
            totalAmount: data.totalAmount || 0,
            subtotal: data.subtotal || 0,
            status: data.status || 'pending',
            paymentStatus: data.paymentStatus || 'unpaid',
            paymentDetails: data.paymentDetails || {},
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          };
        });
        setOrders(ordersData);
        setLoading(false);
      });

      return unsubscribe;
    };

    const unsubscribe = fetchOrders();
    return () => unsubscribe();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdating(prev => ({ ...prev, [orderId]: true }));
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    } finally {
      setUpdating(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const updatePaymentStatus = async (orderId: string, newStatus: string) => {
    setUpdating(prev => ({ ...prev, [orderId]: true }));
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        paymentStatus: newStatus,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Failed to update payment status');
    } finally {
      setUpdating(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const openWhatsApp = (phoneNumber: string, orderNumber: string) => { 
    if (!phoneNumber) {
      alert('Nomor telepon tidak tersedia');
      return;
    }

    let cleanPhone = phoneNumber.replace(/\D/g, '');
    
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.substring(1);
    } else if (cleanPhone.startsWith('8')) {
      cleanPhone = '62' + cleanPhone;
    } else if (!cleanPhone.startsWith('62')) {
      cleanPhone = '62' + cleanPhone;
    }

    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      alert('Format nomor telepon tidak valid');
      return;
    }

    const message = `Halo, saya dari tim customer service. Terkait pesanan Anda dengan nomor ${orderNumber}, apakah ada yang bisa kami bantu?`;
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    
    console.log('Original phone:', phoneNumber);
    console.log('Cleaned phone:', cleanPhone);
    console.log('WhatsApp URL:', whatsappUrl);
    
    window.open(whatsappUrl, '_blank');
  };

  const getStatusColor = (status: string, type = 'status') => {
    const options = type === 'status' ? statusOptions : paymentStatusOptions;
    const statusObj = options.find(opt => opt.value === status);
    return statusObj ? statusObj.color : '#6b7280';
  };

  const getStatusLabel = (status: string, type = 'status') => {
    const options = type === 'status' ? statusOptions : paymentStatusOptions;
    const statusObj = options.find(opt => opt.value === status);
    return statusObj ? statusObj.label : status;
  };

  const formatCurrency = (totalAmount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(totalAmount);
  };

  const formatDate = (date: Date) => {
    if (!date) return '-';
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const columns = useMemo<MRT_ColumnDef<Order>[]>(
    () => [
      {
        accessorKey: 'orderNumber',
        header: 'Order Number',
        size: 150,
        Cell: ({ row }) => (
          <Box>
            <Box sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
              {row.original.orderNumber}
            </Box>
            <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
              {row.original.items?.length || 0} items
            </Box>
          </Box>
        ),
      },
      {
        accessorKey: 'shippingAddress.recipientName',
        header: 'Customer',
        size: 180,
        Cell: ({ row }) => (
          <Box>
            <Box sx={{ fontWeight: 'medium', fontSize: '0.875rem' }}>
              {row.original.shippingAddress?.recipientName}
            </Box>
            <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
              {row.original.shippingAddress?.phoneNumber}
            </Box>
          </Box>
        ),
      },
      {
        accessorKey: 'totalAmount',
        header: 'Amount',
        size: 150,
        Cell: ({ row }) => (
          <Box>
            <Box sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
              {formatCurrency(row.original.totalAmount)}
            </Box>
            <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
              Subtotal: {formatCurrency(row.original.subtotal)}
            </Box>
          </Box>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 140,
        Cell: ({ row }) => (
          <FormControl size="small" fullWidth>
            <Select
              value={row.original.status}
              onChange={(e) => updateOrderStatus(row.original.id, e.target.value)}
              disabled={updating[row.original.id]}
              sx={{ fontSize: '0.75rem' }}
            >
              {statusOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ),
        filterVariant: 'select',
        filterSelectOptions: statusOptions.map(option => ({
          text: option.label,
          value: option.value,
        })),
      },
      {
        accessorKey: 'paymentStatus',
        header: 'Payment',
        size: 160,
        Cell: ({ row }) => (
          <FormControl size="small" fullWidth>
            <Select
              value={row.original.paymentStatus}
              onChange={(e) => updatePaymentStatus(row.original.id, e.target.value)}
              disabled={updating[row.original.id]}
              sx={{ fontSize: '0.75rem' }}
            >
              {paymentStatusOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ),
        filterVariant: 'select',
        filterSelectOptions: paymentStatusOptions.map(option => ({
          text: option.label,
          value: option.value,
        })),
      },
      {
        accessorKey: 'createdAt',
        header: 'Date',
        size: 140,
        Cell: ({ row }) => formatDate(row.original.createdAt),
        sortingFn: 'datetime',
      },
    ],
    [updating, statusOptions, paymentStatusOptions]
  );

  // MRT Table configuration
  const table = useMaterialReactTable({
    columns,
    data: orders,
    enableColumnFilters: true,
    enableGlobalFilter: true,
    enableSorting: true,
    enablePagination: true,
    enableRowActions: true,
    positionActionsColumn: 'last',
    renderRowActions: ({ row }) => (
      <Box sx={{ display: 'flex', gap: '0.5rem' }}>
        <Tooltip title="View Details">
          <IconButton
            onClick={() => {
              setSelectedOrder(row.original);
              setShowDetailModal(true);
            }}
            size="small"
          >
            <Eye size={16} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Contact via WhatsApp">
          <IconButton
            onClick={() => openWhatsApp(row.original.shippingAddress?.phoneNumber, row.original.orderNumber)}
            size="small"
            sx={{ color: '#25d366' }}
          >
            <MessageCircle size={16} />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    initialState: {
      pagination: { pageSize: 10, pageIndex: 0 },
      sorting: [{ id: 'createdAt', desc: true }],
    },
    muiTableProps: {
      sx: {
        '& .MuiTableHead-root': {
          '& .MuiTableCell-root': {
            backgroundColor: '#f9fafb',
            fontWeight: 'bold',
          },
        },
      },
    },
    muiTableBodyRowProps: {
      sx: {
        '&:hover': {
          backgroundColor: '#f9fafb',
        },
      },
    },
    state: {
      isLoading: loading,
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:p-5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#5C4033] mb-2">Order Management</h1>
        </div>

        {/* Material React Table */}
        <div className="bg-white rounded-lg shadow">
          <MaterialReactTable table={table} />
        </div>

        {/* Order Detail Modal */}
        {showDetailModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Order Info */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-3">Order Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Order Number:</span>
                          <span className="font-medium">{selectedOrder.orderNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span 
                            className="px-2 py-1 rounded-full text-xs text-white"
                            style={{ backgroundColor: getStatusColor(selectedOrder.status) }}
                          >
                            {getStatusLabel(selectedOrder.status)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Created:</span>
                          <span>{formatDate(selectedOrder.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Updated:</span>
                          <span>{formatDate(selectedOrder.updatedAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-3">Shipping Address</h3>
                      <div className="text-sm space-y-1">
                        <div className="font-medium">{selectedOrder.shippingAddress?.recipientName}</div>
                        <div>{selectedOrder.shippingAddress?.phoneNumber}</div>
                        <div>{selectedOrder.shippingAddress?.fullAddress}</div>
                        <div>
                          {selectedOrder.shippingAddress?.district}, {selectedOrder.shippingAddress?.city}
                        </div>
                        <div>
                          {selectedOrder.shippingAddress?.province} {selectedOrder.shippingAddress?.postalCode}
                        </div>
                        {selectedOrder.shippingAddress?.notes && (
                          <div className="mt-2 p-2 bg-yellow-50 rounded">
                            <span className="text-xs text-yellow-800">Notes: {selectedOrder.shippingAddress.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Payment & Items */}
                  <div className="space-y-4">
                    {/* Payment Details */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-3">Payment Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span 
                            className="px-2 py-1 rounded-full text-xs text-white"
                            style={{ backgroundColor: getStatusColor(selectedOrder.paymentStatus, 'payment') }}
                          >
                            {getStatusLabel(selectedOrder.paymentStatus, 'payment')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Method:</span>
                          <span className="font-medium">{selectedOrder.paymentDetails?.method || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bank:</span>
                          <span>{selectedOrder.paymentDetails?.bankName || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Account:</span>
                          <span>{selectedOrder.paymentDetails?.accountNumber || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Sender:</span>
                          <span>{selectedOrder.paymentDetails?.senderName || '-'}</span>
                        </div>
                        {selectedOrder.paymentDetails?.paymentProofUrl && (
                          <div className="mt-2">
                            <a
                              href={selectedOrder.paymentDetails.paymentProofUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              View Payment Proof
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
                      <div className="space-y-3">
                        {selectedOrder.items?.map((item, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                            <Image
                            src={item.productImage}
                            alt={item.productName}
                            width={48}
                            height={48}
                            className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1">
                              <div className="font-medium text-sm">{item.productName}</div>
                              <div className="text-xs text-gray-500">
                                Qty: {item.quantity} × {formatCurrency(item.price)}
                              </div>
                            </div>
                            <div className="text-sm font-medium">
                              {formatCurrency(item.subtotal)}
                            </div>
                          </div>
                        ))}
                        <div className="border-t pt-3 mt-3">
                          <div className="flex justify-between text-sm">
                            <span>Subtotal:</span>
                            <span>{formatCurrency(selectedOrder.subtotal)}</span>
                          </div>
                          <div className="flex justify-between text-lg font-bold">
                            <span>Total:</span>
                            <span>{formatCurrency(selectedOrder.totalAmount)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => openWhatsApp(selectedOrder.shippingAddress?.phoneNumber, selectedOrder.orderNumber)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Contact Customer
                  </button>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;