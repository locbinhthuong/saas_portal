import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../data/AuthContext';
import { LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect back to where the user came from (e.g., checkout)
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
       if (result.role === 'ADMIN') {
         navigate('/admin', { replace: true });
       } else {
         navigate('/', { replace: true });
       }
    } else {
       alert(result.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-4">
            <LogIn size={24} />
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Đăng nhập</h1>
          <p className="text-slate-500 mt-2">Truy cập vào bảng điều khiển hệ thống NTL.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email của bạn</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 outline-none" placeholder="admin@ntl.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 outline-none" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition shadow-lg shadow-primary-500/30">
            Đăng nhập ngay
          </button>
        </form>
        
        <p className="text-center mt-6 text-slate-600 text-sm">
          Bạn chưa có tài khoản? <Link to="/register" className="text-primary-600 font-bold hover:underline">Đăng ký mới</Link>
        </p>
      </div>
    </div>
  );
}
