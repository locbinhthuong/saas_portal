import { connectDB } from '../../utils/db.js';
import Tenant from '../../models/Tenant.js';
import User from '../../models/User.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
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
      return res.status(403).json({ message: 'Chỉ Admin mới có quyền xem danh sách này' });
    }

    await connectDB();

    // Lấy tất cả Tenant và tìm User Admin tương ứng cho mỗi Tenant
    const tenants = await Tenant.find({}).sort({ createdAt: -1 }).lean();
    
    // Gắn thêm email của chủ sở hữu (User) vào từng Tenant
    const tenantsWithUsers = await Promise.all(tenants.map(async (tenant) => {
      const user = await User.findOne({ tenantId: tenant._id }).select('email name');
      return {
        ...tenant,
        owner: user ? user.name : 'Unknown',
        email: user ? user.email : 'Unknown'
      };
    }));

    return res.status(200).json(tenantsWithUsers);
  } catch (error) {
    console.error(error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token không hợp lệ' });
    }
    return res.status(500).json({ message: 'Lỗi server' });
  }
}
