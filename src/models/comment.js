import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    userId: { type: String, required: true },
    videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
    videoOwnerId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('comment', commentSchema);
