import { connectDB } from '../../utils/db.js';
import Tenant from '../../models/Tenant.js';
import Product from '../../models/Product.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Không có quyền truy cập' });
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_for_local_dev';
    const decoded = jwt.verify(token, jwtSecret);

    if (!decoded.tenantId) {
      return res.status(400).json({ message: 'Tài khoản của bạn không gắn với Cửa hàng nào.' });
    }

    await connectDB();

    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: 'Thiếu thông tin sản phẩm.' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại.' });
    }

    // Cập nhật Tenant
    // Trong thực tế, ở đây sẽ verify Webhook Stripe / VNPay
    // Đặt ngày hết hạn dùng thử (ví dụ: +7 ngày)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const updatedTenant = await Tenant.findByIdAndUpdate(
      decoded.tenantId,
      {
        status: 'TRIAL',
        subscriptionPlan: product.name,
        trialExpiresAt: expiresAt
      },
      { new: true }
    );

    // Bơm dữ liệu mẫu (Data Seeding)
    const TenantCustomer = (await import('../../models/TenantCustomer.js')).default;
    // Xóa dữ liệu cũ nếu có
    await TenantCustomer.deleteMany({ tenantId: decoded.tenantId });
    // Bơm 2 mẫu
    await TenantCustomer.create([
      { tenantId: decoded.tenantId, name: 'Khách hàng mẫu 1 (VIP)', phone: '0901234567', email: 'vip@gmail.com' },
      { tenantId: decoded.tenantId, name: 'Khách hàng mẫu 2', phone: '0987654321', email: 'kh2@gmail.com' }
    ]);

    return res.status(200).json({ 
      message: 'Đăng ký thành công. Đã nạp dữ liệu mẫu!',
      tenant: updatedTenant
    });

  } catch (error) {
    console.error('Checkout API error:', error);
    return res.status(500).json({ message: 'Lỗi server khi thanh toán.' });
  }
}
