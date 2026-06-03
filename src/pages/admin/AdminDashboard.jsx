import React from 'react';
import { Package, Users, DollarSign, TrendingUp } from 'lucide-react';
import { useProducts } from '../../data/ProductContext';
import { useAuth } from '../../data/AuthContext';

export default function AdminDashboard() {
  const { products } = useProducts();
  const { users } = useAuth();
  
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-display font-bold text-slate-900 mb-8">Tổng Quan Hệ Thống</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign size={24} />
            </div>
          </div>
          <p className="text-sm text-slate-500 font-medium mb-1">Doanh thu dự kiến</p>
          <h3 className="text-2xl font-bold font-display text-slate-800">12,500,000 ₫</h3>
          <p className="text-xs text-green-600 flex items-center gap-1 mt-2">
            <TrendingUp size={14} /> +15% so với tháng trước
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Package size={24} />
            </div>
          </div>
          <p className="text-sm text-slate-500 font-medium mb-1">Số lượng ứng dụng (Apps)</p>
          <h3 className="text-2xl font-bold font-display text-slate-800">{products?.length || 0}</h3>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <Users size={24} />
            </div>
          </div>
          <p className="text-sm text-slate-500 font-medium mb-1">Khách hàng Đăng ký</p>
          <h3 className="text-2xl font-bold font-display text-slate-800">{users?.length || 0} Người</h3>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-bold font-display text-slate-800 mb-4">Khách hàng mới nhất</h3>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
             <tr>
               <th className="px-4 py-3 rounded-l-lg">Khách hàng</th>
               <th className="px-4 py-3">Phần mềm thuê</th>
               <th className="px-4 py-3">Tình trạng</th>
               <th className="px-4 py-3 rounded-r-lg">Hạn dùng</th>
             </tr>
          </thead>
          <tbody>
             <tr className="border-b border-slate-50">
               <td className="px-4 py-4 font-medium">Nguyễn Văn A</td>
               <td className="px-4 py-4">AloShipp Express</td>
               <td className="px-4 py-4"><span className="text-green-600 bg-green-50 px-2 py-1 rounded-md font-medium text-xs">Hoạt động</span></td>
               <td className="px-4 py-4 text-slate-500">30 ngày</td>
             </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
