import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Box } from 'lucide-react';
import { useProducts } from '../../data/ProductContext';

export default function ProductList() {
  const { products, deleteProduct } = useProducts();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Quản lý Sản Phẩm</h1>
          <p className="text-slate-500">Danh sách các phần mềm đang được bán trên SaaS Portal.</p>
        </div>
        <Link to="/admin/products/new" className="bg-primary-600 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-primary-700 transition">
          <Plus size={20} /> Thêm Sản Phẩm Mới
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 font-medium">Icon</th>
              <th className="px-6 py-4 font-medium">Tên Phần Mềm</th>
              <th className="px-6 py-4 font-medium">Giá Thuê / Tháng</th>
              <th className="px-6 py-4 font-medium text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr key={product._id || product.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${product.color || 'from-slate-400 to-slate-500'} flex items-center justify-center p-2 shadow-sm`}>
                   {product.imgUrl ? <img src={product.imgUrl} className="w-full h-full object-cover rounded-md" alt="icon"/> : <Box className="text-white" size={24} />}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-800 text-base">{product.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{product.category}</p>
                </td>
                <td className="px-6 py-4 font-bold text-slate-800 text-base">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.pricing?.monthly || 0)}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => { if(window.confirm('Chắc chắn xóa?')) deleteProduct(product._id || product.id) }} className="p-2 text-slate-400 hover:text-red-600 bg-white rounded-lg border border-slate-200 shadow-sm transition-colors">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
               <tr><td colSpan="4" className="text-center py-8 text-slate-500">Chưa có sản phẩm nào.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
