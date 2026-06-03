import { connectDB } from '../utils/db.js';
import Product from '../models/Product.js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  await connectDB();

  if (req.method === 'GET') {
    try {
      const products = await Product.find({}).sort({ createdAt: -1 });
      return res.status(200).json(products);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Lỗi server' });
    }
  }

  if (req.method === 'POST') {
    try {
      // TODO: Thêm middleware kiểm tra quyền Admin sau
      const { name, category, description, icon, color, features, demoUrl, pricing } = req.body;
      
      const newProduct = await Product.create({
        name, category, description, icon, color, features, demoUrl, pricing
      });
      
      return res.status(201).json(newProduct);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Lỗi server khi thêm sản phẩm' });
    }
  }

  res.status(405).json({ message: 'Method not allowed' });
}
