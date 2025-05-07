"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = event.currentTarget;
    const namaLengkap = (
      form.elements.namedItem("namalengkap") as HTMLInputElement
    ).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;
    const confirmPassword = (
      form.elements.namedItem("confirmPassword") as HTMLInputElement
    ).value;

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: namaLengkap,
          email,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Terjadi kesalahan saat mendaftar");
      }

      form.reset();
      router.push("/login");
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen overflow-hidden">
      <div className="w-1/2 relative flex items-center justify-center bg-gray-100">
        <img
          src="/assets/signinsignup1.png"
          alt="Fashion Show"
          className="w-full h-full max-h-screen object-cover shadow-lg"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
      </div>

      <div className="w-1/2 flex items-center justify-center bg-gradient-to-b from-gray-100 to-white">
        <div className="w-full max-w-md px-8 py-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Buat Akun</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-1 text-gray-800">
                Nama Lengkap
              </label>
              <input
                name="namalengkap"
                type="text"
                placeholder="Masukkan Nama Lengkap"
                className="w-full h-[45px] text-sm border-2 border-gray-300 rounded-[8px] px-4 py-2 focus:outline-none focus:ring focus:ring-yellow-300 text-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1 text-gray-800">
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="Masukkan Email"
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
                placeholder="Masukkan Password"
                className="w-full h-[45px] text-sm border-2 border-gray-300 rounded-[8px] px-4 py-2 focus:outline-none focus:ring focus:ring-yellow-300 text-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1 text-gray-800">
                Konfirmasi Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                placeholder="Konfirmasi Password"
                className="w-full h-[45px] text-sm border-2 border-gray-300 rounded-[8px] px-4 py-2 focus:outline-none focus:ring focus:ring-yellow-300 text-black"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[45px] bg-yellow-400 text-white py-2 rounded-[18px] font-bold shadow-md hover:bg-yellow-500 transition disabled:bg-yellow-300 disabled:cursor-not-allowed"
            >
              {loading ? "Memproses..." : "Sign Up"}
            </button>
          </form>
          <p className="mt-4 text-sm text-center text-gray-800">
            Sudah punya akun?{" "}
            <span
              onClick={() => router.push("/login")}
              className="font-bold text-black cursor-pointer hover:underline"
            >
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
