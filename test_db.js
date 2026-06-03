import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://tanlocdepzai123:toilaTanLoc%403112@cluster0.orqalcz.mongodb.net/?appName=Cluster0';

async function testConnection() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { dbName: 'saas_marketplace' });
    console.log('Connected successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Connection failed:', error);
    process.exit(1);
  }
}

testConnection();
