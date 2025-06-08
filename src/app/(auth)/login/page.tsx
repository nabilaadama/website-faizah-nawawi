"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from '@/lib/firebase/firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function Signin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = event.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      // Gunakan Firebase Auth langsung
      await signInWithEmailAndPassword(auth, email, password);
      
      // Redirect setelah login berhasil
      const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || '/';
      router.push(redirectUrl);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* Left Side: Form */}
      <div className="w-1/2 flex items-center justify-center bg-gradient-to-b from-gray-100 to-white">
        <div className="w-full max-w-md px-8 py-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Welcome Back👋🏻
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-1 text-gray-800">
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="Enter Your Email"
                className="w-full h-[45px] text-sm border-2 border-gray-300 rounded-[8px] px-4 py-2 focus:outline-none focus:ring focus:ring-yellow-300 text-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1 text-gray-800">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Enter Your Password"
                className="w-full h-[45px] text-sm border-2 border-gray-300 rounded-[8px] px-4 py-2 focus:outline-none focus:ring focus:ring-yellow-300 text-black"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[45px] bg-yellow-400 text-white py-2 rounded-[18px] font-bold shadow-md hover:bg-yellow-500 transition disabled:bg-yellow-300 disabled:cursor-not-allowed"
            >
              {loading ? "Memproses..." : "Login"}
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-800">
            Not have an account?{" "}
            <span
              onClick={() => router.push("/register")}
              className="font-bold text-black cursor-pointer hover:underline"
            >
              Register
            </span>
          </p>
        </div>
      </div>

      {/* Right Side: Image with overlay */}
      <div className="w-1/2 relative flex items-center justify-center bg-gray-100">
        <img
          src="/assets/signinsignup1.png"
          alt="Fashion Show"
          className="w-full h-full max-h-screen object-cover shadow-lg"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
      </div>
    </div>
  );
}
