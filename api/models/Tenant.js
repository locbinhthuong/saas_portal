import mongoose from 'mongoose';

const TenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Store/Tenant name is required'],
  },
  subdomain: {
    type: String,
    unique: true,
    required: [true, 'Subdomain is required'],
    lowercase: true,
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'TRIAL', 'EXPIRED', 'SUSPENDED'],
    default: 'TRIAL',
  },
  trialExpiresAt: {
    type: Date,
    required: true,
  }
}, { timestamps: true });

export default mongoose.models.Tenant || mongoose.model('Tenant', TenantSchema);
