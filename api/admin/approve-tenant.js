import { connectDB } from '../../utils/db.js';
import Tenant from '../../models/Tenant.js';
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

    if (decoded.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Chỉ Admin mới có quyền duyệt đơn' });
    }

    await connectDB();

    const { tenantId } = req.body;
    if (!tenantId) {
      return res.status(400).json({ message: 'Thiếu tenantId.' });
    }

    const tenant = await Tenant.findById(tenantId);
    if (!tenant || tenant.status !== 'PENDING_PAYMENT') {
      return res.status(400).json({ message: 'Tenant không ở trạng thái chờ duyệt.' });
    }

    // Đặt ngày hết hạn dùng thử/gói cước (ví dụ: +30 ngày)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    tenant.status = 'ACTIVE';
    tenant.trialExpiresAt = expiresAt;
    await tenant.save();

    // Bơm dữ liệu mẫu (Data Seeding) khi kích hoạt thành công
    const TenantCustomer = (await import('../../models/TenantCustomer.js')).default;
    await TenantCustomer.deleteMany({ tenantId: tenant._id });
    await TenantCustomer.create([
      { tenantId: tenant._id, name: 'Khách hàng mẫu 1 (VIP)', phone: '0901234567', email: 'vip@gmail.com' },
      { tenantId: tenant._id, name: 'Khách hàng mẫu 2', phone: '0987654321', email: 'kh2@gmail.com' }
    ]);

    return res.status(200).json({ 
      message: 'Duyệt thành công và đã cấp phát dữ liệu mẫu!',
      tenant
    });

  } catch (error) {
    console.error('Approve Tenant error:', error);
    return res.status(500).json({ message: 'Lỗi server khi duyệt.' });
  }
}
