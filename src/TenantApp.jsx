import React, { useState, useEffect } from 'react';

export default function TenantApp({ subdomain }) {
  const [tenantInfo, setTenantInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Trong thực tế, bạn sẽ gọi API `GET /api/tenant/lookup?subdomain=${subdomain}`
    // để lấy cấu hình (Logo, Màu sắc, Trạng thái) của Tenant này.
    setTimeout(() => {
      setTenantInfo({
        subdomain,
        name: subdomain === 'tiembanh' ? 'Tiệm Bánh Trăng Khuyết' : `Cửa hàng ${subdomain}`,
        status: 'ACTIVE'
      });
      setLoading(false);
    }, 1000);
  }, [subdomain]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">Đang tải không gian làm việc...</div>;
  }

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
          <a href="#" className="block px-4 py-3 bg-blue-600 text-white rounded-xl font-medium">Bảng điều khiển</a>
          <a href="#" className="block px-4 py-3 hover:bg-slate-800 rounded-xl font-medium transition-colors">Đơn hàng</a>
          <a href="#" className="block px-4 py-3 hover:bg-slate-800 rounded-xl font-medium transition-colors">Khách hàng</a>
          <a href="#" className="block px-4 py-3 hover:bg-slate-800 rounded-xl font-medium transition-colors">Báo cáo</a>
        </nav>
        <div className="p-4 border-t border-slate-800 text-xs text-center text-slate-500">
          Powered by NTL_BinhThuong
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 justify-between shrink-0">
          <h1 className="font-bold text-slate-800">Bảng Điều Khiển</h1>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200"></div>
            <span className="text-sm font-medium text-slate-700">Admin Cửa Hàng</span>
          </div>
        </header>
        
        <div className="flex-1 p-6 overflow-auto">
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-sm text-slate-500 font-medium mb-1">Đơn hàng hôm nay</p>
              <h3 className="text-2xl font-bold text-slate-800">12</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-sm text-slate-500 font-medium mb-1">Doanh thu</p>
              <h3 className="text-2xl font-bold text-slate-800">4,500,000 ₫</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-sm text-slate-500 font-medium mb-1">Khách mới</p>
              <h3 className="text-2xl font-bold text-slate-800">5</h3>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-96 flex items-center justify-center text-slate-400">
            Khu vực hiển thị biểu đồ & dữ liệu của {tenantInfo.name}
          </div>
        </div>
      </main>
    </div>
  );
}
