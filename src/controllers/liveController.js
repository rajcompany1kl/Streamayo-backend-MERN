import asyncHandler from '../middlewares/asyncHandler.js';
import * as liveService from '../services/liveService.js';

export const getAllLives = asyncHandler(async (req, res) => {
  const data = await liveService.getAllLiveRooms();
  res.json(data);
});

export const endRoom = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const result = await liveService.endLiveRoom(roomId);
  res.json(result);
});

export const getRoomMetadata = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const metadata = await liveService.getRoomMetadata(roomId);
  res.json(metadata);
});