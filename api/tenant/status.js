import { connectDB } from '../../utils/db.js';
import Tenant from '../../models/Tenant.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
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
      return res.status(400).json({ message: 'Tài khoản không hợp lệ' });
    }

    await connectDB();
    const tenant = await Tenant.findById(decoded.tenantId);
    if (!tenant) {
      return res.status(404).json({ message: 'Không tìm thấy Tenant' });
    }

    // Tính toán vòng đời (Lifecycle)
    let workflowStatus = 'ACTIVE';
    let daysDiff = 0;
    
    if (tenant.status === 'TRIAL' || tenant.status === 'ACTIVE') {
      if (tenant.trialExpiresAt) {
        const now = new Date();
        const expiresAt = new Date(tenant.trialExpiresAt);
        const msDiff = now - expiresAt;
        daysDiff = Math.floor(msDiff / (1000 * 60 * 60 * 24));

        if (daysDiff > 3) {
          workflowStatus = 'HARD_BLOCK';
        } else if (daysDiff > 0) {
          workflowStatus = 'SOFT_BLOCK';
        }
      }
    } else {
      workflowStatus = 'HARD_BLOCK';
    }

    return res.status(200).json({
      name: tenant.name,
      subdomain: tenant.subdomain,
      status: tenant.status,
      workflowStatus,
      daysOverdue: daysDiff > 0 ? daysDiff : 0,
      expiresAt: tenant.trialExpiresAt
    });
  } catch (error) {
    console.error('Tenant Status API error:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
}
