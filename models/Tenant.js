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
    enum: ['PENDING_PAYMENT', 'ACTIVE', 'TRIAL', 'EXPIRED', 'SUSPENDED'],
    default: 'PENDING_PAYMENT',
  },
  trialExpiresAt: {
    type: Date,
    required: true,
  },
  subscriptionPlan: {
    type: String,
    default: 'Free Trial',
  }
}, { timestamps: true });

export default mongoose.models.Tenant || mongoose.model('Tenant', TenantSchema);
