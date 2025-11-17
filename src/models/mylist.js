import mongoose from 'mongoose';

const myListSchema = new mongoose.Schema(
  {
    videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
    userId: { type: String, required: true },
    videoOwnerId: { type: String, required: true },
    userName: { type: String, required: true },
    userImageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('mylist', myListSchema);
