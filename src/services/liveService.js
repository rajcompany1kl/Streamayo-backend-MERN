import LiveRoom from '../models/liveroom.js';
import logger from '../utils/logger.js';

export async function getAllLiveRooms() {
  const liveRooms = await LiveRoom.find().lean();
  return { liveRooms };
}

export async function createLiveRoom(userId, roomId, userImageUrl, userName, title, description, thumbnailUrl) {
  const existing = await LiveRoom.findOne({ roomId });
  if (existing) return existing;
  const newRoom = new LiveRoom({ userId, roomId, userImageUrl, userName, title, description, thumbnailUrl });
  await newRoom.save();
  logger.info(`[DB] Live room created: ${roomId}`);
  return newRoom;
}

export async function endLiveRoom(roomId) {
  const deleted = await LiveRoom.findOneAndDelete({ roomId }).lean();
  return deleted ? { deletedRoom: deleted } : { message: 'Room not found' };
}

export async function getRoomMetadata(roomId) {
  const room = await LiveRoom.findOne({ roomId }).lean();
  if (!room) throw Object.assign(new Error('Live room not found'), { status: 404 });
  console.log("Room metadata:", room);
  return room;
}