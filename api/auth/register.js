import { connectDB } from '../../utils/db.js';
import User from '../../models/User.js';
import Tenant from '../../models/Tenant.js';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  // CORS Headers cho Vercel Serverless
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
    const { email, password, name, storeName, subdomain } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!email || !password || !name || !storeName || !subdomain) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
    }

    // 1. Kiểm tra Email hoặc Subdomain đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email này đã được sử dụng' });
    }

    const existingTenant = await Tenant.findOne({ subdomain: subdomain.toLowerCase() });
    if (existingTenant) {
      return res.status(400).json({ message: 'Subdomain này đã có người đăng ký' });
    }

    // 2. Tạo Tenant mới (Khởi tạo tự động - Auto Provisioning)
    const trialDays = 7;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + trialDays);

    const newTenant = await Tenant.create({
      name: storeName,
      subdomain: subdomain.toLowerCase(),
      status: 'TRIAL',
      trialExpiresAt: expiresAt,
    });

    // 3. Tạo User và liên kết với Tenant vừa tạo
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      role: 'TENANT',
      tenantId: newTenant._id,
    });

    return res.status(201).json({
      message: 'Đăng ký thành công! Hệ thống đã cấp phát Subdomain cho bạn.',
      tenant: newTenant,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('Lỗi API Đăng ký:', error);
    return res.status(500).json({ message: 'Lỗi Server nội bộ' });
  }
}
