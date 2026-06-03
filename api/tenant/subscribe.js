import { connectDB } from '../utils/db.js';
import Tenant from '../models/Tenant.js';
import Product from '../models/Product.js';
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
    // Đặt trạng thái chờ duyệt, chưa set thời gian hết hạn vì chưa duyệt
    const updatedTenant = await Tenant.findByIdAndUpdate(
      decoded.tenantId,
      {
        status: 'PENDING_PAYMENT',
        subscriptionPlan: product.name,
      },
      { new: true }
    );

    return res.status(200).json({ 
      message: 'Gửi yêu cầu thanh toán thành công!',
      tenant: updatedTenant
    });

  } catch (error) {
    console.error('Checkout API error:', error);
    return res.status(500).json({ message: 'Lỗi server khi thanh toán.' });
  }
}
