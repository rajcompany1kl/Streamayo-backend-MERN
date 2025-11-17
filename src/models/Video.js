import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String },
    thumbnailUrl: { type: String },
    userId: { type: String, required: true },
    views: { type: Number, default: 0 },
    likesCount: { type: Number, default: 0 },
    dislikeCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    live: { type: Boolean, default: false },
    duration: { type: String },
    userName: { type: String},
    userImageUrl: { type: String}
  },
  { timestamps: true }
);

videoSchema.index({ title: 'text', description: 'text'}, { weights: { title: 5, description: 1 } });

export default mongoose.model('Video', videoSchema);
