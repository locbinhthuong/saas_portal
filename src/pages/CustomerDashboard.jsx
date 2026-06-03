import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Package, CreditCard, Settings, ExternalLink, LogOut, CheckCircle2 } from 'lucide-react';
import { useProducts } from '../data/ProductContext';
import { useAuth } from '../data/AuthContext';

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState('apps');
  const { products } = useProducts();
  const { currentUser, logout } = useAuth();
  const [tenantInfo, setTenantInfo] = useState(null);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const token = localStorage.getItem('saas_auth_token');
        if (!token) return;
        const res = await fetch('/api/tenant/info', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setTenantInfo(data.tenant);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchTenant();
  }, []);

  // Lấy dữ liệu mua hàng (Tạm thời mockup theo gói đăng ký ban đầu)
  // Trong thực tế sẽ lấy từ DB phần Purchases
  const appData = products && products.length > 0 ? products[0] : null;

  return (
    <div className="min-h-screen bg-slate-50 flex pt-20">
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:block fixed h-full z-10">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 mb-8 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold font-display shadow-md">
              N
            </div>
            <span className="font-display font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Về Trang Chủ</span>
          </Link>
          
          <h2 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-4">Quản lý không gian</h2>
          <nav className="space-y-2">
            <button onClick={() => setActiveTab('apps')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'apps' ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-100'}`}>
              <LayoutDashboard size={20} /> Phần mềm của tôi
            </button>
            <button onClick={() => setActiveTab('billing')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'billing' ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-100'}`}>
              <CreditCard size={20} /> Thanh toán & Gói cước
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors">
              <Settings size={20} /> Lịch sử hoạt động
            </button>
          </nav>
        </div>
        
        <div className="absolute bottom-20 left-0 w-full p-6">
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors">
            <LogOut size={20} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">Xin chào, {currentUser?.name || 'Khách hàng'} 👋</h1>
              <p className="text-slate-500">Quản lý tất cả hệ thống và phần mềm bạn đang thuê tại NTL_BinhThuong.</p>
            </div>
          </header>

          {activeTab === 'apps' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-display text-slate-800">Cửa hàng: {tenantInfo?.name || 'Chưa cập nhật'}</h2>
              
              {tenantInfo ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-center">
                   <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg`}>
                     <Package className="w-10 h-10 text-white" />
                   </div>
                   <div className="flex-1">
                     <div className="flex items-center gap-3 mb-1">
                       <h3 className="text-2xl font-bold font-display">{tenantInfo.name}</h3>
                       <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                         <CheckCircle2 size={14}/> {tenantInfo.status === 'TRIAL' ? 'Đang dùng thử' : 'Đang chạy'}
                       </span>
                     </div>
                     <p className="text-slate-500 text-sm mb-4">Gói Doanh Nghiệp (Tối đa 100 tài xế)</p>
                     
                     <div className="flex gap-4 text-sm font-medium">
                       <div className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                         <span className="text-slate-400 block text-xs">Máy chủ khu vực</span>
                         <span className="text-slate-700">VN-HCM-01</span>
                       </div>
                       <div className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                         <span className="text-slate-400 block text-xs">Trạng thái Database</span>
                         <span className="text-green-600">Ổn định</span>
                       </div>
                     </div>
                   </div>
                   
                   <div className="flex flex-col gap-3 w-full md:w-auto">
                     <a href={`/?workspace=${tenantInfo.subdomain}&token=${localStorage.getItem('saas_auth_token')}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20">
                       Mở Hệ Thống <ExternalLink size={18} />
                     </a>
                     <button className="flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-6 py-3 rounded-xl font-medium hover:bg-slate-50 transition-colors">
                       Cấu hình Tên miền
                     </button>
                   </div>
                </motion.div>
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed">
                  <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 mb-4">Bạn chưa có phần mềm nào đang hoạt động.</p>
                  <Link to="/" className="inline-block bg-slate-900 text-white px-6 py-2 rounded-full font-medium">Khám phá cửa hàng</Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'billing' && (
             <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold font-display text-slate-800 mb-1">Ví thanh toán NTL</h3>
                    <p className="text-slate-500 text-sm">Số dư dùng để gia hạn tự động các dịch vụ.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold font-display text-primary-600">0 ₫</p>
                    <button className="text-sm font-medium text-primary-600 hover:bg-primary-50 px-3 py-1 rounded-lg mt-1 transition-colors">Nạp thêm tiền</button>
                  </div>
                </div>
                
                <h2 className="text-xl font-bold font-display text-slate-800 pt-4">Lịch sử giao dịch</h2>
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4">Mã Giao Dịch</th>
                        <th className="px-6 py-4">Dịch vụ</th>
                        <th className="px-6 py-4">Số tiền</th>
                        <th className="px-6 py-4">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tenantInfo ? (
                        <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                          <td className="px-6 py-4 font-mono text-slate-600">TXN-{tenantInfo._id ? tenantInfo._id.substring(0, 6).toUpperCase() : '89234'}</td>
                          <td className="px-6 py-4 font-medium">Gói {tenantInfo.name || 'Phần mềm'} (Dùng thử)</td>
                          <td className="px-6 py-4 text-slate-900">0 ₫</td>
                          <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Thành công</span></td>
                        </tr>
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center py-8 text-slate-400">Chưa có giao dịch nào</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
             </div>
          )}

        </div>
      </main>
    </div>
  );
}
