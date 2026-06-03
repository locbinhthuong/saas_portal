import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../data/AuthContext';
import { UserPlus } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', storeName: '', subdomain: '', password: '' });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(formData.name, formData.email, formData.password, formData.storeName, formData.subdomain);
    if (result.success) {
       navigate('/dashboard', { replace: true });
    } else {
       alert(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
            <UserPlus size={24} />
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Tạo tài khoản</h1>
          <p className="text-slate-500 mt-2">Bắt đầu quản lý doanh nghiệp với NTL.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Họ và tên Quản trị viên</label>
            <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 outline-none" placeholder="VD: Nguyễn Văn A" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 outline-none" placeholder="email@congty.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tên Cửa Hàng / Doanh Nghiệp</label>
            <input type="text" required value={formData.storeName} onChange={e => setFormData({...formData, storeName: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 outline-none" placeholder="VD: Tiệm Bánh Trăng Khuyết" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tên miền phụ (Subdomain)</label>
            <div className="flex items-center">
              <input type="text" required value={formData.subdomain} onChange={e => setFormData({...formData, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '')})} className="w-full px-4 py-3 rounded-l-xl border border-slate-200 border-r-0 focus:border-primary-500 focus:ring-2 outline-none" placeholder="tiembanh" />
              <span className="bg-slate-100 border border-slate-200 border-l-0 px-4 py-3 rounded-r-xl text-slate-500">.saas.com</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Chỉ nhập chữ thường và số (vd: tiembanh)</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu</label>
            <input type="password" required minLength={6} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 outline-none" placeholder="Ít nhất 6 ký tự" />
          </div>
          <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg mt-2">
            Đăng ký tài khoản
          </button>
        </form>
        
        <p className="text-center mt-6 text-slate-600 text-sm">
          Đã có tài khoản? <Link to="/login" className="text-primary-600 font-bold hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
