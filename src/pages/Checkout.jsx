import React, { useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../data/AuthContext';
import { ArrowLeft, CreditCard, QrCode, CheckCircle2 } from 'lucide-react';
import { useProducts } from '../data/ProductContext';

export default function Checkout() {
  const { productId } = useParams();
  const { products } = useProducts();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const product = products.find(p => p.id === productId);
  const [step, setStep] = useState(1);
  
  if (!product) {
    return <div className="pt-32 text-center">Sản phẩm không tồn tại</div>;
  }

  const nextStep = () => {
    if (!currentUser) {
      navigate('/login', { state: { from: location } });
      return;
    }
    setStep(2);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 font-medium">
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </Link>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Form Area */}
          <div className="md:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100"
            >
              {step === 1 && (
                <div>
                  <h3 className="text-xl font-bold font-display text-slate-900 mb-6">Thông tin khởi tạo nền tảng</h3>
                  {!currentUser && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-medium">
                      Bạn cần Đăng Nhập hoặc Đăng Ký tài khoản trước khi tiếp tục.
                    </div>
                  )}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Tên Doanh Nghiệp / Thương Hiệu</label>
                      <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" placeholder="Nhập tên doanh nghiệp" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Họ và tên người đăng ký</label>
                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" placeholder="Nhập họ tên" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại</label>
                        <input type="tel" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" placeholder="09xxxxxxx" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email (Dùng để nhận Web App)</label>
                      <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" placeholder="email@domain.com" />
                    </div>
                    
                    <button 
                      onClick={nextStep}
                      className={`w-full mt-6 py-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${currentUser ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-slate-400 text-white cursor-not-allowed'}`}
                    >
                      {currentUser ? 'Tiếp Tục & Thanh Toán' : 'Đăng nhập để mua lúc này'} <CreditCard className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
              
              {step === 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="text-2xl font-display font-bold mb-2">Thanh toán bằng VietQR</h2>
                  <p className="text-slate-500 mb-6">Mở app Ngân hàng và quét mã để thanh toán tự động.</p>
                  
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col items-center justify-center text-center">
                    <div className="w-48 h-48 bg-white p-2 rounded-xl border border-slate-200 shadow-sm mb-4">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=pay_${product.pricing.monthly}`} alt="QR Code" className="w-full h-full object-cover" />
                    </div>
                    <p className="font-medium text-slate-900">Số tiền: <span className="text-xl font-bold text-primary-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.pricing.monthly)}</span></p>
                    <p className="text-sm text-slate-500 mt-2">Nội dung: <strong>NTL {product.id} {Math.floor(1000 + Math.random() * 9000)}</strong></p>
                  </div>
                  
                  <button 
                    onClick={() => setStep(3)}
                    className="w-full mt-6 bg-primary-600 text-white py-4 rounded-xl font-medium hover:bg-primary-700 transition-colors"
                  >
                    Tôi đã chuyển khoản
                  </button>
                </motion.div>
              )}
              
              {step === 3 && (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h2 className="text-3xl font-display font-bold mb-4">Đăng ký thành công!</h2>
                  <p className="text-slate-600 mb-8 max-w-md mx-auto">
                    Chúng tôi đang khởi tạo hệ thống <strong>{product.name}</strong> cho doanh nghiệp của bạn. Thông tin truy cập sẽ được gửi vào Email trong vòng 10 phút.
                  </p>
                  <button 
                    onClick={() => {
                      localStorage.setItem('purchasedApp', product.id);
                      window.location.href = '/dashboard';
                    }}
                    className="inline-block bg-slate-900 text-white px-8 py-3 rounded-full font-medium hover:bg-slate-800 transition-colors"
                  >
                    Vào Bảng Điều Khiển Của Bạn
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
          
          {/* Order Summary */}
          <div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-900 rounded-3xl p-6 text-white sticky top-28"
            >
              <h3 className="text-lg font-display font-bold mb-4">Tổng quan đơn hàng</h3>
              <div className="flex gap-4 mb-6 pb-6 border-b border-white/10">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${product.color} flex items-center justify-center shrink-0`}>
                  <QrCode className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-medium">{product.name}</h4>
                  <p className="text-sm text-slate-400">Gói 1 Tháng</p>
                </div>
              </div>
              
              <div className="space-y-3 text-sm mb-6 pb-6 border-b border-white/10">
                <div className="flex justify-between">
                  <span className="text-slate-400">Giá gói</span>
                  <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.pricing.monthly)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ưu đãi</span>
                  <span className="text-green-400">- 0 ₫</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <span className="text-slate-300">Tổng cộng</span>
                <span className="text-2xl font-bold font-display">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.pricing.monthly)}</span>
              </div>
              
              <div className="bg-white/10 rounded-xl p-4 text-sm text-slate-300 flex gap-3">
                <div className="shrink-0 pt-1">🛡️</div>
                <p>Thanh toán bảo mật 100%. Hỗ trợ hoàn tiền trong 7 ngày nếu không hài lòng.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
