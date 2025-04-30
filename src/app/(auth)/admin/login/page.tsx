// export default function CartPage() {
//   return <h3>Shopping Cart</h3>;
// }

//HARUSNYA INI ADA FOLDER SENDIRINYAAA BUAKN DI FOLDER INIII TP COBACOBAJI DLUU HEHEHE

import React from "react"; 
import { UserCog } from "lucide-react"; 
 
const Login: React.FC = () => { 
  return ( 
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFE082] via-[#C2A78D] via-[#A18674] via-[#D9C2A8] via-[#FAF3E0] via-[#F5E5D0] to-[#7D7D7D]"> 
      {/* Background Blur Layer */} 
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFE082] via-[#C2A78D] via-[#A18674] via-[#D9C2A8] via-[#FAF3E0] via-[#F5E5D0] to-[#7D7D7D] opacity-40 blur-3xl"></div> 
 
      {/* Additional colorful circles */} 
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#C2A78D] rounded-full opacity-15 blur-3xl -translate-x-1/2 -translate-y-1/2"></div> 
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#A18674] rounded-full opacity-15 blur-3xl translate-x-1/2 translate-y-1/2"></div> 
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-[#7D7D7D] rounded-full opacity-10 blur-3xl -translate-x-1/2 -translate-y-1/2"></div> 
 
      {/* Card */} 
      <div className="relative z-10 bg-white bg-opacity-80 backdrop-blur-md rounded-xl shadow-xl px-12 py-14 w-[515px]"> 
        {/* Icon Bulat with Lucide UserCog icon */} 
        <div className="flex justify-center -mt-24 mb-6"> 
          <div className="w-24 h-24 bg-[#FFC30C] rounded-full flex items-center justify-center shadow-lg"> 
            <UserCog size={48} className="text-white" /> 
          </div> 
        </div> 
 
        <h1 className="text-3xl font-bold text-center text-[#4A4A4A] mb-8"> 
          Login Admin 
        </h1> 
 
        <form className="space-y-6"> 
          <div> 
            <label className="block text-sm font-bold mb-1 text-gray-800"> 
              Username 
            </label> 
            <input 
              type="text" 
              placeholder="Masukkan Username" 
              className="w-[422px] h-[45px] border border-gray-300 rounded-[8px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FFC30C] text-sm text-black" 
            /> 
          </div> 
 
          <div> 
            <label className="block text-sm font-bold mb-1 text-gray-800"> 
              Password 
            </label> 
            <input 
              type="password" 
              placeholder="Masukkan Password" 
              className="w-[422px] h-[45px] border border-gray-300 rounded-[8px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FFC30C] text-sm text-black" 
            /> 
          </div> 
 
          <button 
            type="submit" 
            className="w-[422px] h-[45px] bg-[#FFC30C] hover:bg-yellow-500 text-white shadow-md transition font-semibold py-3 rounded-[18px]" 
          > 
            Login 
          </button> 
        </form> 
      </div> 
    </div> 
  ); 
}; 
 
export default Login;