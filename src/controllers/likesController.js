import asyncHandler from '../middlewares/asyncHandler.js';
import * as likesService from '../services/likesService.js';

export const likeVideo = asyncHandler(async (req, res) => {
  const { videoId, videoOwnerId } = req.params;
  const { userId } = req.body;
     if (req.auth.userId !== userId) {
  return res.status(403).json({ message: "Forbidden: Not your data" });
}
  res.json({ likes: await likesService.likeVideo(videoId, userId, videoOwnerId) });
});

export const dislikeVideo = asyncHandler(async (req, res) => {
  const { videoId, videoOwnerId } = req.params;
  const { userId } = req.body;
    if (req.auth.userId !== userId) {
  return res.status(403).json({ message: "Forbidden: Not your data" });
}
  res.json({ likes: await likesService.dislikeVideo(videoId, userId, videoOwnerId) });
});

export const getLikeStatus = asyncHandler(async (req, res) => {
  const { videoId, userId } = req.params;
    if (req.auth.userId !== userId) {
  return res.status(403).json({ message: "Forbidden: Not your data" });
}
  res.json(await likesService.isLiked(videoId, userId));
});

export const getLikedVideos = asyncHandler(async (req, res) => {
     if (req.auth.userId !== req.params.userId) {
  return res.status(403).json({ message: "Forbidden: Not your data" });
}
  const response = await likesService.getLikedVideos(req.params.userId);
  console.log(response);
  res.json(response);

});
