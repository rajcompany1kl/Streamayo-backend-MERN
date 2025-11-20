import Video from '../models/Video.js';
import MyList from '../models/mylist.js'
import Comment from '../models/comment.js';
import Subscription from '../models/Subscription.js';
import * as userService from './userService.js';


export async function getAllVideos() {
  console.log("Fetching all videos");
  const videos = await Video.find().lean();
  if (!videos.length) return { users: [], videos: [] };

   const userIds = [...new Set(videos.map(v => v.userId))];
   const users = await Promise.all(userIds.map(id => userService.getUserById(id)));
 
  return { users, videos }; 
}

export async function getVideoById(id) {
  const video = await Video.findById(id).lean();
  if (!video) throw Object.assign(new Error('Video not found'), { status: 404 });

  const user = await userService.getUserById(video.userId);
  return { ...video, userImageUrl: user.imageUrl, userName: `${user.firstName} ${user.lastName}` };
}

export async function getVideosByUserId(userId) {
  return Video.find({ userId }).lean();
}

export async function uploadToCloud(metadata) {
  const video = new Video(metadata);
  return video.save();
}

// ---------- MyList ----------
export async function saveVideo(userId, videoId, videoOwnerId, videoOwnerName, videoOwnerUrl) {
  const existing = await MyList.findOne({ userId, videoId });
  if (existing) {
    await MyList.deleteOne({ userId, videoId });
    return { message: 'Video removed from list' };
  }
  const item = await MyList.create({ userId, videoId, videoOwnerId, userName: videoOwnerName, userImageUrl: videoOwnerUrl });
  return item.populate('videoId');
}

export async function isSaved(userId, videoId) {
  const status = await MyList.findOne({ userId, videoId });
  console.log("isSaved status:", status);
  return !!(await MyList.findOne({ userId, videoId })); 
}

export async function savedVideos(userId) {
  const saved = await MyList.find({ userId }).populate('videoId').lean();
  console.log("saved videos yeri", saved)
   return saved.map(v => ({
     ...v.videoId,
   }));
 
}

export async function limitedSavedVideos(userId, pageLimit, skip) {
 const saved = await MyList.find({ userId }).populate('videoId').sort({ createdAt: -1 }).skip(skip).limit(pageLimit).lean();
   return saved.map(v => ({
     ...v.videoId,
   }));
}

// ---------- Subscriptions ----------
export async function subscribe(creatorId, userId, checking) {
  const existing = await Subscription.findOne({ creatorId, userId });
  if (checking) return !!existing;

  if (existing) {
    await Subscription.deleteOne({ creatorId, userId });
    return 'Unsubscribed';
  }
  await Subscription.create({ creatorId, userId });
  return 'Subscribed';
}

export async function subscribedVids(userId) {
  const subs = await Subscription.find({ userId }).lean();
  if (!subs.length) return 'No Subscriptions';

  const creatorIds = subs.map(s => s.creatorId);
  const videos = await Video.find({ userId: { $in: creatorIds } })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  const creators = await Promise.all(creatorIds.map(id => userService.getUserById(id)));

  const enriched = videos.map(video => {
    const user = creators.find(u => u.id === video.userId);
    return { ...video, userName: `${user.firstName} ${user.lastName}`, userImageUrl: user.imageUrl };
  });

  return enriched.reduce((map, v) => {
    const uid = String(v.userId);
    if (!map[uid]) map[uid] = [];
    map[uid].push(v);
    return map;
  }, {});
}

// ---------- Comments ----------
export async function getComments(videoId) {
  const comments = await Comment.find({ videoId }).lean();
  if (!comments.length) return [];

  const users = await Promise.all(comments.map(c => userService.getUserById(c.userId)));
  return comments.map((c, i) => ({
    ...c,
    userName: `${users[i].firstName} ${users[i].lastName}`,
    userImageUrl: users[i].imageUrl,
  }));
}

export async function addComment(videoId, userId, text) {
  if (!text || !text.trim()) throw Object.assign(new Error('Comment cannot be empty'), { status: 400 });
  const comment = await Comment.create({ videoId, userId, text });
  const user = await userService.getUserById(userId);
  return { ...comment.toObject(), userName: `${user.firstName} ${user.lastName}`, userImageUrl: user.imageUrl };
}
 
export async function searchVideos(query) {
  try {
    
 console.log("Searching videos with query:", query);
  if (!query || query.trim() === '') return [];

  const results = await Video.find(
    { $text: { $search: query } },
    { score: { $meta: "textScore" } }
  )
  .sort({ score: { $meta: "textScore" } })
  .limit(7)
  .lean();

  return results;
   } catch (error) {
     console.error("Error searching videos:", error);
  }
}

export async function getLimitedVideos(skip, limit) {
  const videos = await Video.find().sort({ createdAt: 1 }).skip(skip).limit(limit).lean();
   if (!videos.length) return { videos: [] };
  return { videos }; 
}

export async function viewed(videoId){
// const video = await Video.findById(videoId);

//   if (!video) return null;  // optional safety check

//   video.views += 1;
//   await video.save();       // MUST await
await Video.findByIdAndUpdate(
    videoId,
    { $inc: { views: 1 } },
    { new: true }
  );

}