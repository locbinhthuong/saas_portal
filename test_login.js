import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = 'mongodb+srv://tanlocdepzai123:toilaTanLoc%403112@cluster0.orqalcz.mongodb.net/?appName=Cluster0';

async function test() {
  await mongoose.connect(MONGODB_URI);
  const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false }));
  const users = await User.find({});
  console.log('Users in DB:', users.map(u => u.email));
  
  const admin = await User.findOne({ email: 'admin@ntl.com' });
  if (admin) {
    const isMatch = await bcrypt.compare('123456', admin.password);
    console.log('Password match:', isMatch);
  }
  await mongoose.disconnect();
}
test();
