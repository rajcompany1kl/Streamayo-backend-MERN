import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    creatorId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Subscription', subscriptionSchema);
