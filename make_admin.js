import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = 'mongodb+srv://tanlocdepzai123:toilaTanLoc%403112@cluster0.orqalcz.mongodb.net/?appName=Cluster0';

async function makeAdmin() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: 'saas_marketplace' });
    console.log('Connected to MongoDB (saas_marketplace)');
    
    // We don't need the full model, just use raw collection or a simple schema
    const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
      email: String,
      role: String
    }, { strict: false }));

    // Check if admin exists
    let admin = await User.findOne({ email: 'admin@ntl.com' });
    if (!admin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('123456', salt);
      admin = await User.create({
        email: 'admin@ntl.com',
        password: hashedPassword,
        name: 'Super Admin',
        role: 'ADMIN'
      });
      console.log('Đã tạo tài khoản Admin mặc định: admin@ntl.com / 123456');
    } else {
      admin.role = 'ADMIN';
      await admin.save();
      console.log('Tài khoản admin@ntl.com đã tồn tại, đã đảm bảo quyền ADMIN.');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

makeAdmin();
