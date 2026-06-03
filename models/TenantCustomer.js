import mongoose from 'mongoose';

const TenantCustomerSchema = new mongoose.Schema({
  // TRƯỜNG QUAN TRỌNG NHẤT BẮT BUỘC PHẢI CÓ ĐỂ CÁCH LY DỮ LIỆU
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String
  }
}, { timestamps: true });

// Đánh Index để query nhanh theo tenantId
TenantCustomerSchema.index({ tenantId: 1 });

export default mongoose.models.TenantCustomer || mongoose.model('TenantCustomer', TenantCustomerSchema);
