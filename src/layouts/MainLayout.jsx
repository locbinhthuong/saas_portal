import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAuth } from '../data/AuthContext';
import { motion } from 'framer-motion';

export default function MainLayout() {
  const { currentUser } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 cyber-grid text-slate-900 layer-3d">
      {/* Floating 3D Navbar */}
      <header className="fixed top-4 left-4 right-4 md:left-8 md:right-8 z-50 card-3d rounded-full py-3 px-6 max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl font-display shadow-lg group-hover:scale-110 transition-transform">
            N
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">NTL_BinhThuong</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 font-medium text-slate-600">
          <Link to="/" className="hover:text-blue-600 transition-colors hover:scale-105">Sản Phẩm</Link>
          <Link to="/" className="hover:text-violet-600 transition-colors hover:scale-105">Bảng Giá</Link>
          <Link to="/" className="hover:text-fuchsia-600 transition-colors hover:scale-105">Tài Liệu</Link>
        </nav>
        
        <div className="hidden md:flex items-center gap-4">
          {currentUser ? (
             <Link to="/dashboard" className="bg-slate-900 text-white px-5 py-2.5 rounded-full font-medium hover:bg-slate-800 transition shadow-md border border-slate-700">
               Vào Quản Trị ({currentUser.name})
             </Link>
          ) : (
             <>
               <Link to="/login" className="text-slate-600 font-medium hover:text-blue-600 transition-colors">Đăng nhập</Link>
               <Link to="/register" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2.5 rounded-full font-bold hover:scale-105 transition-all shadow-lg border border-blue-400">
                 Mở cửa hàng
               </Link>
             </>
          )}
        </div>
      </header>

      <main className="flex-grow pt-24 relative z-10">
        <Outlet />
      </main>

      <footer className="bg-white/80 backdrop-blur-md text-slate-500 py-12 border-t border-slate-200 relative z-20">
        <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center gap-3 mb-4">
               <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold font-display shadow-md">
                N
               </div>
               <span className="font-display font-bold text-slate-900 text-lg tracking-tight">NTL_BinhThuong Core</span>
            </div>
            <p className="text-sm">Giải pháp công nghệ Đa chiều cho doanh nghiệp tương lai.</p>
          </div>
          <div className="text-sm">
            © 2026 NTL_BinhThuong. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
