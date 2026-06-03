import { connectDB } from '../../utils/db.js';
import TenantCustomer from '../../models/TenantCustomer.js';
import Tenant from '../../models/Tenant.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
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
      return res.status(400).json({ message: 'Tài khoản không gắn với Cửa hàng nào.' });
    }

    await connectDB();

    // GET /api/tenant/customers
    if (req.method === 'GET') {
      // DATA ISOLATION RULE: Bắt buộc filter theo tenantId
      const customers = await TenantCustomer.find({ tenantId: decoded.tenantId }).sort({ createdAt: -1 });
      return res.status(200).json(customers);
    }

    // POST /api/tenant/customers
    if (req.method === 'POST') {
      const { name, phone, email } = req.body;
      if (!name || !phone) {
        return res.status(400).json({ message: 'Vui lòng nhập tên và SĐT' });
      }

      // FEATURE GATE (Giới hạn Quota)
      // Để hoàn chỉnh, ta nên truy vấn bảng Tenant để xem status. 
      // Nhưng để demo nhanh, ta chỉ cho tối đa 5 bản ghi.
      const count = await TenantCustomer.countDocuments({ tenantId: decoded.tenantId });
      if (count >= 5) {
        return res.status(403).json({ message: 'QUOTA EXCEEDED: Gói dùng thử chỉ cho phép tối đa 5 khách hàng. Vui lòng thanh toán để thêm mới!' });
      }

      const newCustomer = await TenantCustomer.create({
        tenantId: decoded.tenantId, // Gắn cứng từ Token, chống giả mạo
        name,
        phone,
        email
      });
      return res.status(201).json(newCustomer);
    }

    return res.status(405).json({ message: 'Method not allowed' });

  } catch (error) {
    console.error('Tenant Customers API error:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
}
