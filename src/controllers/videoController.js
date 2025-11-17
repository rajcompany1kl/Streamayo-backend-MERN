import asyncHandler from '../middlewares/asyncHandler.js';
import * as videoService from '../services/videoService.js';
import cloudinary from '../config/cloudinary.js';

export const getAllVideos = asyncHandler(async (req, res) => {
  res.json(await videoService.getAllVideos());
});

export const getVideoById = asyncHandler(async (req, res) => {
  res.json(await videoService.getVideoById(req.params.id));
});

export const getVideosByUserId = asyncHandler(async (req, res) => {
  res.json(await videoService.getVideosByUserId(req.params.userId));
});

export const uploadToCloud = asyncHandler(async (req, res) => {
  const video = await videoService.uploadToCloud(req.body);
  res.status(201).json(video);
});

export const getUploadSignature = (req, res) => {
  const timestamp = Math.floor(Date.now() / 1000);
  console.log("cloudinary api secret:", process.env.CLOUDINARY_API_SECRET);
  const signature = cloudinary.utils.api_sign_request({ timestamp, folder: 'videos' }, process.env.CLOUDINARY_API_SECRET);

  res.json({ signature, timestamp, apiKey: process.env.CLOUDINARY_API_KEY, cloudName: process.env.CLOUDINARY_CLOUD_NAME });
};

// ---------- MyList ----------
export const saveVideo = asyncHandler(async (req, res) => {
  const { videoId, userId } = req.params;
  const { videoOwnerDetails } = req.body;
  const { videoOwnerId, videoOwnerName, videoOwnerUrl } = videoOwnerDetails;
  res.json(await videoService.saveVideo(userId, videoId, videoOwnerId, videoOwnerName, videoOwnerUrl));
});

export const savedVideos = asyncHandler(async (req, res) => {
  res.json(await videoService.savedVideos(req.params.userId));
});

export const getSaveStatus = asyncHandler(async (req, res) => {
  const status = await videoService.isSaved(req.params.userId, req.params.videoId);
  res.json(status);
});

// ---------- Subscription ----------
export const subscribe = asyncHandler(async (req, res) => {
  const { creatorId, userId, checking } = req.params;
  res.json(await videoService.subscribe(creatorId, userId, checking === 'true'));
});

export const subscribedVids = asyncHandler(async (req, res) => {
  res.json(await videoService.subscribedVids(req.params.userId));
});

// ---------- Comments ----------
export const getComments = asyncHandler(async (req, res) => {
  res.json(await videoService.getComments(req.params.videoId));
});

export const addComment = asyncHandler(async (req, res) => {
  const { videoId, userId } = req.params;
  res.status(201).json(await videoService.addComment(videoId, userId, req.body.text));
});

// ............. search .............
export const searchVideos = asyncHandler(async (req, res) => {
  const query = req.params.query;
  res.json(await videoService.searchVideos(query));
});

export const getLimitedVideos = asyncHandler(async (req, res) => {
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10;
  res.json(await videoService.getLimitedVideos(skip, limit));
});