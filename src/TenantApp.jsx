import React, { useState, useEffect } from 'react';

export default function TenantApp({ subdomain }) {
  const [tenantInfo, setTenantInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({ name: '', phone: '' });

  useEffect(() => {
    // Giả lập load thông tin tenant từ API /api/tenant/lookup
    setTimeout(() => {
      setTenantInfo({
        subdomain,
        name: subdomain === 'tiembanh' ? 'Tiệm Bánh Trăng Khuyết' : `Cửa hàng ${subdomain}`,
        status: 'ACTIVE'
      });
      setLoading(false);
    }, 500);
  }, [subdomain]);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('saas_auth_token');
      const res = await fetch('/api/tenant/customers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch(e) {}
  };

  useEffect(() => {
    if (tenantInfo?.status === 'ACTIVE') {
      fetchCustomers();
    }
  }, [tenantInfo]);

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return alert('Nhập tên và SĐT');
    try {
      const token = localStorage.getItem('saas_auth_token');
      const res = await fetch('/api/tenant/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormData({ name: '', phone: '' });
        fetchCustomers();
      } else {
        const err = await res.json();
        alert(err.message);
      }
    } catch(e) {}
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50">Đang tải không gian làm việc...</div>;

  if (tenantInfo?.status !== 'ACTIVE') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Tài khoản bị tạm khóa</h1>
          <p className="text-slate-600">Vui lòng thanh toán gia hạn để tiếp tục sử dụng phần mềm.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 h-screen hidden md:flex flex-col sticky top-0">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white mb-1">{tenantInfo.name}</h2>
          <p className="text-xs text-slate-400">Workspace: {tenantInfo.subdomain}</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="block px-4 py-3 hover:bg-slate-800 rounded-xl font-medium transition-colors">Bảng điều khiển</a>
          <a href="#" className="block px-4 py-3 bg-blue-600 text-white rounded-xl font-medium">Khách hàng</a>
        </nav>
        <div className="p-4 border-t border-slate-800 text-xs text-center text-slate-500">
          Powered by NTL_BinhThuong
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 justify-between shrink-0">
          <h1 className="font-bold text-slate-800">Quản lý Khách hàng (CRM)</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-700 cursor-pointer" onClick={() => {
              localStorage.removeItem('saas_auth_token');
              window.location.href = '/';
            }}>Đăng xuất</span>
          </div>
        </header>
        
        <div className="flex-1 p-6 overflow-auto">
          {/* Form thêm khách hàng */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
            <h3 className="font-bold text-slate-800 mb-4">Thêm Khách Hàng Mới</h3>
            <form onSubmit={handleAddCustomer} className="flex gap-4">
              <input 
                type="text" 
                placeholder="Tên khách hàng" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
              />
              <input 
                type="text" 
                placeholder="Số điện thoại" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
              />
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition">
                Lưu
              </button>
            </form>
          </div>
          
          {/* Danh sách */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-medium">
                <tr>
                  <th className="px-6 py-4">Tên khách hàng</th>
                  <th className="px-6 py-4">Số điện thoại</th>
                  <th className="px-6 py-4">Ngày tạo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.length === 0 ? (
                  <tr><td colSpan="3" className="px-6 py-8 text-center text-slate-400">Chưa có dữ liệu. Hãy thêm khách hàng đầu tiên!</td></tr>
                ) : (
                  customers.map(c => (
                    <tr key={c._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{c.name}</td>
                      <td className="px-6 py-4">{c.phone}</td>
                      <td className="px-6 py-4">{new Date(c.createdAt).toLocaleDateString('vi-VN')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
