import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: String,
  description: String,
  icon: String,
  color: String,
  features: [String],
  demoUrl: String,
  pricing: {
    monthly: Number,
    yearly: Number,
  }
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
