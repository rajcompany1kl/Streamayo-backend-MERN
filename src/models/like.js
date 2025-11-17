import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
    isComment: { type: Boolean, default: false },
    status: { type: String, enum: ['LIKED', 'DISLIKED'], default: null },
    videoOwnerId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('like', likeSchema);
