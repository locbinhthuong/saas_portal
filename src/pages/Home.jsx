import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Truck, Box, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from '../data/ProductContext';

const iconMap = {
  Truck: <Truck className="w-8 h-8 text-white" />,
  Box: <Box className="w-8 h-8 text-white" />
};

export default function Home() {
  const { products } = useProducts();
  
  return (
    <div className="min-h-screen bg-transparent selection:bg-cyan-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden layer-3d">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-cyan-400/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="text-5xl md:text-7xl font-display font-bold tracking-tight text-slate-900 mb-6 drop-shadow-sm"
          >
            Hệ Sinh Thái <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">NTL_BinhThuong</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10"
          >
            Tự động hóa toàn bộ quy trình kinh doanh của bạn với bộ giải pháp phần mềm đa không gian, mượt mà và đột phá công nghệ.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <a href="#products" className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-full font-bold hover:scale-110 transition-all shadow-lg border border-white/20">
              Khám phá không gian <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-24 relative layer-3d">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-slate-900">Sản Phẩm Tương Lai</h2>
            <p className="text-slate-600 text-lg">Trang bị công nghệ tối tân nhất cho doanh nghiệp của bạn.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12" style={{ perspective: '1200px' }}>
            {products.map((product, index) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 50, rotateX: 20 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.2, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.05, rotateX: 10, rotateY: -5, zIndex: 10 }}
                className="group card-3d p-8 relative overflow-hidden rounded-3xl bg-white/80"
              >
                <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${product.color} opacity-10 rounded-bl-full filter blur-xl group-hover:scale-150 transition-transform duration-700`}></div>
                
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${product.color} flex items-center justify-center mb-6 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                  {iconMap[product.icon] || <Box className="w-8 h-8 text-white" />}
                </div>
                
                <h3 className="text-2xl font-bold font-display mb-2 text-slate-900">{product.name}</h3>
                <span className="inline-block px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-sm text-blue-600 font-medium mb-4">{product.category}</span>
                
                <p className="text-slate-600 mb-8 min-h-[80px]">
                  {product.description}
                </p>
                
                <ul className="space-y-3 mb-8">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-700">
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="flex flex-col gap-3 relative z-20">
                  <Link to={`/product/${product.id || product._id}`} className="block w-full py-3 text-center rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 font-bold transition-all shadow-sm hover:shadow-md">
                    Xem Chi Tiết & Dùng Thử
                  </Link>
                  <Link to={`/checkout/${product.id}`} className="block w-full py-3 text-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold transition-all hover:scale-[1.02] shadow-md">
                    Thuê từ {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.pricing.monthly)} / Tháng
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
