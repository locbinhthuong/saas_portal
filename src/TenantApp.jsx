import React, { useState, useEffect } from 'react';

export default function TenantApp({ subdomain }) {
  const [tenantInfo, setTenantInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({ name: '', phone: '' });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem('saas_auth_token');
        const res = await fetch('/api/tenant/status', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setTenantInfo(data);
        } else {
          setTenantInfo({ workflowStatus: 'ERROR' });
        }
      } catch(e) {
        setTenantInfo({ workflowStatus: 'ERROR' });
      }
      setLoading(false);
    };
    fetchStatus();
  }, [subdomain]);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('saas_auth_token');
      const res = await fetch('/api/tenant/customers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch(e) {}
  };

  useEffect(() => {
    if (tenantInfo?.workflowStatus === 'ACTIVE' || tenantInfo?.workflowStatus === 'SOFT_BLOCK') {
      fetchCustomers();
    }
  }, [tenantInfo]);

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    if (tenantInfo?.workflowStatus === 'SOFT_BLOCK') {
      return alert('Tài khoản đã quá hạn. Chức năng thêm mới bị khóa!');
    }
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

  const exportCSV = () => {
    const headers = ['Tên khách hàng,Số điện thoại,Ngày tạo'];
    const rows = customers.map(c => `"${c.name}","${c.phone}","${new Date(c.createdAt).toLocaleDateString('vi-VN')}"`);
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `khachhang_${tenantInfo?.subdomain}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50">Đang tải không gian làm việc...</div>;

  if (tenantInfo?.workflowStatus === 'HARD_BLOCK' || tenantInfo?.workflowStatus === 'ERROR') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-red-200 max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">!</div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Tài khoản bị khóa</h1>
          <p className="text-slate-600 mb-6">Không gian làm việc của bạn đã bị khóa do quá hạn thanh toán hơn 3 ngày. Vui lòng thanh toán để mở lại hệ thống.</p>
          <a href="/" className="inline-block bg-slate-900 text-white px-6 py-3 rounded-xl font-medium w-full">Về Trang chủ thanh toán</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 h-screen hidden md:flex flex-col sticky top-0">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white mb-1">{tenantInfo?.name || 'Workspace'}</h2>
          <p className="text-xs text-slate-400">Workspace: {tenantInfo?.subdomain}</p>
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

        {tenantInfo?.workflowStatus === 'SOFT_BLOCK' && (
          <div className="bg-orange-50 border-b border-orange-200 px-6 py-3 flex items-center justify-between shrink-0">
            <div className="text-orange-800 text-sm font-medium">
              ⚠️ Tài khoản của bạn đã quá hạn {tenantInfo.daysOverdue} ngày. Tính năng Thêm mới đã bị khóa. Vui lòng gia hạn để tiếp tục sử dụng đầy đủ!
            </div>
            <a href="/" className="bg-orange-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-orange-700">Gia hạn ngay</a>
          </div>
        )}
        
        <div className="flex-1 p-6 overflow-auto">
          {/* Form thêm khách hàng */}
          <div className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8 ${tenantInfo?.workflowStatus === 'SOFT_BLOCK' ? 'opacity-50 pointer-events-none' : ''}`}>
            <h3 className="font-bold text-slate-800 mb-4">Thêm Khách Hàng Mới {tenantInfo?.workflowStatus === 'SOFT_BLOCK' && '(Bị khóa)'}</h3>
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
              <button type="submit" disabled={tenantInfo?.workflowStatus === 'SOFT_BLOCK'} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition disabled:bg-slate-300">
                Lưu
              </button>
            </form>
          </div>
          
          {/* Danh sách */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Danh sách ({customers.length})</h3>
              <button onClick={exportCSV} className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-2">
                ⬇ Xuất File CSV
              </button>
            </div>
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
