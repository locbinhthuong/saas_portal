import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Settings, Users, ArrowLeft } from 'lucide-react';

export default function AdminLayout() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-slate-900 text-slate-300 fixed h-full z-10 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <Link to="/admin" className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center font-bold font-display text-white">N</div>
            <span className="font-bold font-display tracking-wide uppercase">Super Admin</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${location.pathname === '/admin' ? 'bg-primary-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>
            <LayoutDashboard size={20} /> Tổng Quan
          </Link>
          <Link to="/admin/products" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive('/admin/products') ? 'bg-primary-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>
            <Package size={20} /> Quản lý Ứng dụng
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium hover:bg-slate-800 hover:text-white transition-colors text-left">
            <Users size={20} /> Khách hàng
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium hover:bg-slate-800 hover:text-white transition-colors text-left">
            <Settings size={20} /> Cài đặt Hệ thống
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={16} /> Quay lại Website
          </Link>
        </div>
      </aside>
      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}
