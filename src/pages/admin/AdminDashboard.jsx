import React, { useState, useEffect } from 'react';
import { Package, Users, DollarSign, TrendingUp } from 'lucide-react';
import { useProducts } from '../../data/ProductContext';
import { useAuth } from '../../data/AuthContext';

export default function AdminDashboard() {
  const { products } = useProducts();
  const [tenants, setTenants] = useState([]);
  
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const token = localStorage.getItem('saas_auth_token');
        if (!token) return;
        const res = await fetch('/api/admin/tenants', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setTenants(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    
    fetchTenants();
  }, []);
  
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
          <h3 className="text-2xl font-bold font-display text-slate-800">0 ₫</h3>
          <p className="text-xs text-green-600 flex items-center gap-1 mt-2">
            <TrendingUp size={14} /> Hệ thống mới
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
          <h3 className="text-2xl font-bold font-display text-slate-800">{tenants.length} Người</h3>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-bold font-display text-slate-800 mb-4">Khách hàng mới nhất</h3>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
             <tr>
               <th className="px-4 py-3 rounded-l-lg">Khách hàng</th>
               <th className="px-4 py-3">Tên cửa hàng (Subdomain)</th>
               <th className="px-4 py-3">Tình trạng</th>
               <th className="px-4 py-3 rounded-r-lg">Gói cước</th>
             </tr>
          </thead>
          <tbody>
            {tenants.map(tenant => (
             <tr key={tenant._id} className="border-b border-slate-50 hover:bg-slate-50">
               <td className="px-4 py-4 font-medium">
                 {tenant.owner}
                 <div className="text-xs text-slate-400 font-normal">{tenant.email}</div>
               </td>
               <td className="px-4 py-4">
                 <span className="font-medium text-slate-700">{tenant.name}</span>
                 <a href={`/?workspace=${tenant.subdomain}`} target="_blank" rel="noreferrer" className="block text-xs text-blue-500 hover:underline">
                   Mở Workspace ({tenant.subdomain})
                 </a>
               </td>
               <td className="px-4 py-4">
                 {tenant.status === 'TRIAL' ? (
                   <span className="text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md font-medium text-xs">Dùng thử</span>
                 ) : tenant.status === 'ACTIVE' ? (
                   <span className="text-green-600 bg-green-50 px-2 py-1 rounded-md font-medium text-xs">Hoạt động</span>
                 ) : tenant.status === 'PENDING_PAYMENT' ? (
                   <span className="text-orange-600 bg-orange-50 px-2 py-1 rounded-md font-medium text-xs">Chờ duyệt</span>
                 ) : (
                   <span className="text-red-600 bg-red-50 px-2 py-1 rounded-md font-medium text-xs">Bị khóa</span>
                 )}
               </td>
               <td className="px-4 py-4 text-slate-500">
                 {tenant.subscriptionPlan || 'Miễn phí'}
                 {tenant.status === 'PENDING_PAYMENT' && (
                   <button 
                     onClick={async () => {
                       const token = localStorage.getItem('saas_auth_token');
                       const res = await fetch('/api/admin/approve-tenant', {
                         method: 'POST',
                         headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                         body: JSON.stringify({ tenantId: tenant._id })
                       });
                       if (res.ok) {
                         alert('Duyệt thành công!');
                         window.location.reload();
                       } else {
                         const err = await res.json();
                         alert(err.message);
                       }
                     }}
                     className="block mt-2 bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
                   >
                     Duyệt & Cấp phát
                   </button>
                 )}
               </td>
             </tr>
            ))}
            {tenants.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-8 text-slate-400">Chưa có khách hàng nào</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
