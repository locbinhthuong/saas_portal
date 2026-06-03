import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, PlusCircle, Trash2 } from 'lucide-react';
import { useProducts } from '../../data/ProductContext';

export default function ProductForm() {
  const { addProduct } = useProducts();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    color: 'from-blue-500 to-indigo-500',
    imgUrl: '',
    demoUrl: '',
    pricing: { monthly: 0, yearly: 0 },
    features: ['']
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.name) return alert("Vui lòng nhập tên");
    
    const success = await addProduct({
      ...formData,
      features: formData.features.filter(f => f.trim() !== '')
    });
    
    if (success) {
      navigate('/admin/products');
    }
  };

  const updateFeature = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({...formData, features: newFeatures});
  };

  const addFeatureRow = () => {
    setFormData({...formData, features: [...formData.features, '']});
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/admin/products" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 font-medium">
        <ArrowLeft size={16} /> Quay lại danh sách
      </Link>
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold text-slate-900">Thêm Cửa hàng Sản phẩm mới</h1>
        <button onClick={handleSubmit} className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-primary-700 transition shadow-lg shadow-primary-500/30">
          <Save size={20} /> Lưu Bảng Giá
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <form className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tên Phần Mềm</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 outline-none" placeholder="VD: NTL Booking Spa" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phân loại (Category)</label>
              <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 outline-none" placeholder="VD: Quản lý khách sạn" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả giới thiệu</label>
            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="3" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 outline-none" placeholder="Đoạn văn ngắn giới thiệu về phần mềm báo giá..."></textarea>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Giá Thuê 1 Tháng (VND)</label>
               <input type="number" value={formData.pricing.monthly} onChange={e => setFormData({...formData, pricing: {...formData.pricing, monthly: parseInt(e.target.value)||0}})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 outline-none" />
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Link Hình Ảnh (URL Image) Đại Diện</label>
               <input type="url" value={formData.imgUrl} onChange={e => setFormData({...formData, imgUrl: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 outline-none" placeholder="Bỏ URL tải sẵn ở imgur / v.v. vào đây" />
            </div>
            <div className="md:col-span-2">
               <label className="block text-sm font-medium text-slate-700 mb-1">Link Tải Bản Demo (Google Drive, S3...)</label>
               <input type="url" value={formData.demoUrl} onChange={e => setFormData({...formData, demoUrl: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 outline-none bg-slate-50" placeholder="https://drive.google.com/file/d/..." />
               <p className="text-xs text-slate-500 mt-1">Khách hàng sẽ nhấp vào nút "Tải Bản Dùng Thử" để truy cập link này.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
             <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-slate-700">Các tính năng Gói này gồm có (Features)</label>
                <button type="button" onClick={addFeatureRow} className="text-sm font-medium text-primary-600 flex items-center gap-1 hover:text-primary-700">
                  <PlusCircle size={16} /> Thêm tính năng
                </button>
             </div>
             <div className="space-y-3">
               {formData.features.map((feat, index) => (
                 <div key={index} className="flex items-center gap-3">
                    <input type="text" value={feat} onChange={(e) => updateFeature(index, e.target.value)} className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary-500 outline-none" placeholder="Gõ tính năng... (VD: Không giới hạn dung lượng)" />
                    <button type="button" onClick={() => setFormData({...formData, features: formData.features.filter((_, i) => i !== index)})} className="p-2.5 text-slate-400 hover:text-red-500 bg-slate-50 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                 </div>
               ))}
             </div>
          </div>
        </form>
      </div>
    </div>
  );
}
