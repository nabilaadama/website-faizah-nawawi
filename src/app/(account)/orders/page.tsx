"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { collection, query, where, orderBy, onSnapshot, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase/firebase-config";
import { Order } from "@/core/entities/order"; 

interface UserData {
  id: string;
  email: string;
  name: string;
  role: "customer" | "admin";
}

export default function OrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("Firebase auth state changed:", firebaseUser);
      
      if (firebaseUser) {
        try {
          // Get user data from Firestore
          const docRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const userData = docSnap.data();
            const user: UserData = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: userData.name || '',
              role: userData.role || 'customer'
            };
            
            console.log("User data loaded:", user);
            setUser(user);
          } else {
            console.error("User document not found");
            setError("User data not found");
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
          setError("Failed to fetch user data");
        }
      } else {
        console.log("No user authenticated");
        setUser(null);
      }
      
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log("=== ORDER LOADING EFFECT ===");
    console.log("authLoading:", authLoading);
    console.log("user:", user);
    
    // Wait for auth to complete
    if (authLoading) {
      console.log("Still loading auth...");
      return;
    }
    
    // If no user is authenticated, show error
    if (!user) {
      console.log("No user found, showing error");
      setError("Please log in to view orders");
      setLoading(false);
      return;
    }

    console.log("Loading orders for user:", user);

    const ordersRef = collection(db, "orders");
    let q;
    
    // If user is admin, show all orders. Otherwise, show only user's orders
    if (user.role === "admin") {
      console.log("Loading all orders (admin mode)");
      q = query(ordersRef, orderBy("createdAt", "desc"));
    } else {
      console.log("Loading user orders for:", user.id);
      q = query(
        ordersRef,
        where("userId", "==", user.id),
        orderBy("createdAt", "desc")
      );
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const ordersData: Order[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          ordersData.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as Order);
        });
        
        console.log("Orders loaded:", ordersData.length);
        setOrders(ordersData);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, authLoading]);

  // Rest of your component methods remain the same...
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600";
      case "processing":
        return "text-blue-600";
      case "shipped":
        return "text-purple-600";
      case "delivered":
        return "text-green-600";
      case "cancelled":
        return "text-red-600";
      case "refunded":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  const capitalizeStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading || authLoading) {
    return (
      <div className="p-6 text-black bg-white">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading orders...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-black bg-white">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-6 text-black bg-white">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-500">No orders found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 text-black bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {user?.role === "admin" ? "All Orders" : "My Orders"}
        </h1>
        {user?.role === "admin" && (
          <div className="text-sm text-gray-600">
            Total Orders: {orders.length}
          </div>
        )}
      </div>
      {orders.map((order) => (
        <div key={order.id} className="border-2 rounded-[16px] p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <div>
              <span className="font-medium">Order #{order.orderNumber}</span>{" "}
              <span className={getStatusColor(order.status)}>
                {capitalizeStatus(order.status)}
              </span>
              <p className="text-sm">Date: {formatDate(order.createdAt)}</p>
              <p className="text-sm">Payment: {capitalizeStatus(order.paymentStatus)}</p>
              {user?.role === "admin" && (
                <p className="text-sm text-gray-600">User ID: {order.userId}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
            <div>
              <p className="font-semibold">Shipping Address</p>
              <p>
                <span className="font-medium">Phone:</span> {order.shippingAddress.phoneNumber}
              </p>
              <p>
                <span className="font-medium">Recipient Name:</span> {order.shippingAddress.recipientName}
              </p>
              <p>
                <span className="font-medium">Full Address:</span> {order.shippingAddress.fullAddress}
              </p>
              <p>{order.shippingAddress.district}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.province}</p>
              <p>{order.shippingAddress.postalCode}</p>
            </div>
            
            <div>
              <p className="font-semibold">Payment Method</p>
              <p>{order.paymentDetails?.method || "Not specified"}</p>
              {order.paymentDetails?.bankName && (
                <p>Bank: {order.paymentDetails.bankName}</p>
              )}
            </div>
            
            <div>
              <p className="font-semibold">Order Summary</p>
              <p>Subtotal: {formatPrice(order.subtotal)}</p>
              <p className="font-semibold text-green-600">Total: {formatPrice(order.totalAmount)}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {order.items.map((item) => (
              <div key={item.id || item.productId} className="w-[150px]">
                <div className="relative w-full h-[150px] rounded overflow-hidden">
                  <Image 
                    src={item.productImage || "/placeholder-image.png"} 
                    alt={item.productName}
                    fill
                    sizes="150px"
                    className="object-cover"
                    onError={() => {
                      // Handle error by showing placeholder
                      console.log(`Failed to load image: ${item.productImage}`);
                    }}
                  />
                </div>
                <p className="text-sm mt-1 font-medium">{item.productName}</p>
                {item.size && <p className="text-xs">Size: {item.size}</p>}
                {item.color && <p className="text-xs">Color: {item.color}</p>}
                <p className="text-xs">Qty: {item.quantity}</p>
                <p className="text-sm">{formatPrice(item.price)}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}