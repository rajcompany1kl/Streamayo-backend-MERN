import Like from '../models/like.js';
import Video from '../models/Video.js';
import * as userService from './userService.js';

export async function likeVideo(videoId, userId, videoOwnerId) {
  const existing = await Like.findOne({ videoId, userId, videoOwnerId });
  let likesDelta = 0;
  let dislikesDelta = 0;

  if (!existing) {
    await Like.create({ videoId, userId, videoOwnerId, status: 'LIKED' });
    likesDelta = 1;
  } else if (existing.status === 'DISLIKED') {
    await Like.updateOne({ _id: existing._id }, { status: 'LIKED' });
    likesDelta = 1;
    dislikesDelta = -1;
  } else {
    await Like.deleteOne({ _id: existing._id });
    likesDelta = -1;
  }

  await Video.findByIdAndUpdate(videoId, { $inc: { likesCount: likesDelta, dislikeCount: dislikesDelta } });
  return (await Video.findById(videoId)).likesCount;
}

export async function dislikeVideo(videoId, userId, videoOwnerId) {
  const existing = await Like.findOne({ videoId, userId, videoOwnerId });
  let dislikesDelta = 0;
  let likesDelta = 0;

  if (!existing) {
    await Like.create({ videoId, userId, videoOwnerId, status: 'DISLIKED' });
    dislikesDelta = 1;
  } else if (existing.status === 'LIKED') {
    await Like.updateOne({ _id: existing._id }, { status: 'DISLIKED' });
    dislikesDelta = 1;
    likesDelta = -1;
  } else {
    await Like.deleteOne({ _id: existing._id });
    dislikesDelta = -1;
  }

  await Video.findByIdAndUpdate(videoId, { $inc: { dislikeCount: dislikesDelta, likesCount: likesDelta } });
  return (await Video.findById(videoId)).likesCount;
}

export async function getLikedVideos(userId) {
  const likes = await Like.find({ userId, status: 'LIKED' }).lean();
  if (!likes.length) return [];
  const videos = await Promise.all(likes.map(l => Video.findById(l.videoId).lean()));

  return videos
}

export async function isLiked(videoId, userId) {
  const like = await Like.findOne({ videoId, userId }).lean();
  return like?.status === 'LIKED' ? true : like?.status === 'DISLIKED' ? false : null;
}
