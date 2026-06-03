import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, CheckCircle, Zap, Shield, Smartphone, Box } from 'lucide-react';
import { useProducts } from '../data/ProductContext';

export default function ProductDetail() {
  const { id } = useParams();
  const { products } = useProducts();
  const product = products.find(p => p.id === id);

  if (!product) return <div className="pt-32 text-center text-slate-500">Phần mềm không tồn tại (Hoặc đã bị ẩn).</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Detail Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-900 border-b border-slate-800 text-white">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
        <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br ${product.color || 'from-indigo-600 to-blue-600'} opacity-20 blur-3xl pointer-events-none`}></div>
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" /> Quay lại cửa hàng
          </Link>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
               initial={{ opacity: 0, x: -30 }} 
               animate={{ opacity: 1, x: 0 }} 
               transition={{ duration: 0.6 }}
            >
              <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-sm text-primary-300 font-medium mb-6">
                Chuyên mục: {product.category}
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
                {product.name}
              </h1>
              <p className="text-lg text-slate-300 mb-10 leading-relaxed">
                {product.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={`/checkout/${product.id}`} className="inline-flex justify-center items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-xl font-medium hover:bg-primary-700 transition shadow-lg shadow-primary-600/30">
                  Thuê ngay {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.pricing?.monthly || 0)}
                </Link>
                <button className="inline-flex justify-center items-center gap-2 bg-white/10 text-white px-8 py-4 rounded-xl font-medium hover:bg-white/20 transition backdrop-blur-sm border border-white/10">
                  <Play className="w-5 h-5 fill-white shadow-lg" /> Bản Trải Nghiệm Demo
                </button>
              </div>
            </motion.div>
            
            <motion.div 
               initial={{ opacity: 0, y: 30 }} 
               animate={{ opacity: 1, y: 0 }} 
               transition={{ duration: 0.8, delay: 0.2 }}
               className="relative lg:ml-10"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-600 to-cyan-400 rounded-3xl transform rotate-3 scale-105 opacity-50 blur-lg"></div>
              <div className="relative bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl p-2 aspect-[4/3] flex flex-col items-center justify-center overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-8 bg-slate-900 border-b border-slate-700 flex items-center px-3 gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-500"></div>
                   <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                   <div className="w-3 h-3 rounded-full bg-green-500"></div>
                 </div>
                 
                 {product.imgUrl ? (
                   <img src={product.imgUrl} alt="App UI" className="w-full h-full object-cover mt-8 rounded-lg" />
                 ) : (
                   <div className="mt-8 text-slate-500 flex flex-col items-center gap-4">
                      <Box size={48} className="text-slate-600" />
                      <p className="font-medium text-slate-400">Hình ảnh giao diện phần mềm</p>
                   </div>
                 )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Các tính năng vượt trội</h2>
            <p className="text-slate-500 text-lg">Mọi điều bạn cần để bứt phá đều được tích hợp sẵn.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {product.features?.map((feat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-50 p-6 rounded-2xl border border-slate-100"
              >
                <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                   <CheckCircle size={20} />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{feat}</h3>
                <p className="text-sm text-slate-500">Được thiết kế tối ưu với những thuật toán thông minh đa nền tảng.</p>
              </motion.div>
            ))}
            
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
               <div className="w-10 h-10 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center mb-4">
                  <Zap size={20} />
               </div>
               <h3 className="font-bold text-slate-800 mb-2">Tốc độ siêu tốc</h3>
               <p className="text-sm text-slate-500">Hệ thống phân tán server thông minh giúp giảm độ trễ xuống chỉ còn 20ms.</p>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
               <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mb-4">
                  <Shield size={20} />
               </div>
               <h3 className="font-bold text-slate-800 mb-2">Bảo mật đa tầng</h3>
               <p className="text-sm text-slate-500">Chống xâm nhập bằng thuật toán mã hóa 2 chiều AES-256 cao cấp nhất.</p>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
               <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                  <Smartphone size={20} />
               </div>
               <h3 className="font-bold text-slate-800 mb-2">Đồng bộ Đa thiết bị</h3>
               <p className="text-sm text-slate-500">Dữ liệu cập nhật Real-time trên mọi điện thoại & máy tính ngay lập tức.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
