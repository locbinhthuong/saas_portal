import { connectDB } from '../utils/db.js';
import User from '../models/User.js';
import Tenant from '../models/Tenant.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await connectDB();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' });
    }

    // 1. Tìm User theo email và populate thông tin Tenant
    const user = await User.findOne({ email }).populate('tenantId');
    
    if (!user) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
    }

    // 2. So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
    }

    // 3. Kiểm tra Tenant bị khóa hay chưa
    if (user.tenantId && user.tenantId.status === 'SUSPENDED') {
      return res.status(403).json({ message: 'Tài khoản Workspace của bạn đã bị khóa.' });
    }

    // 4. Tạo JWT Token
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_for_local_dev';
    const token = jwt.sign(
      { 
        userId: user._id, 
        role: user.role,
        tenantId: user.tenantId ? user.tenantId._id : null
      },
      jwtSecret,
      { expiresIn: '7d' }
    );

    // Trả về dữ liệu an toàn (loại bỏ password)
    return res.status(200).json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenant: user.tenantId ? {
          name: user.tenantId.name,
          subdomain: user.tenantId.subdomain,
          status: user.tenantId.status
        } : null
      }
    });

  } catch (error) {
    console.error('Lỗi API Đăng nhập:', error);
    return res.status(500).json({ message: 'Lỗi Server nội bộ' });
  }
}
