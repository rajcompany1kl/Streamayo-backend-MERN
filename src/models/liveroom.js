import mongoose from 'mongoose';

const liveRoomSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    thumbnailUrl: { type: String },
    userId: { type: String, required: true, index: true },
    roomId: { type: String, required: true, unique: true },
    userImageUrl: { type: String, required: true },
    userName: { type: String, required: true },
  },
  { timestamps: true }
);

liveRoomSchema.index({ roomId: 1, userId: 1 });

export default mongoose.model('liveroom', liveRoomSchema);
