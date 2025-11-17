import throttle from 'lodash.throttle';
import { joinRoomCreatorSchema } from '../validations/joinRoomCreatorSchema.js';
import * as liveService from '../services/liveService.js';
import logger from '../utils/logger.js';

export default function liveSocket(nsp) {
  nsp.on('connection', (socket) => {
    logger.info(`[CONNECT] ${socket.id} connected to ${nsp.name}`);

    // Creator joins
    socket.on('join-room-creator', async (data) => {
      const { error, value } = joinRoomCreatorSchema.validate(data);
      if (error) {
        socket.emit('error', { message: error.message });
        return;
      }

      const { userId, roomId, userImageUrl, userName, title, description, thumbnailUrl } = value;

      socket.join(roomId);
      await liveService.createLiveRoom(userId, roomId, userImageUrl, userName, title, description, thumbnailUrl);

      logger.info(`[JOIN-ROOM-CREATOR] client=${socket.id} room=${roomId}`);
      nsp.to(roomId).emit('creator-joined', { roomId, userName });
    });

    // Viewer joins
    socket.on('join-room', (roomId) => {
      if (!roomId) return;
      socket.join(roomId);
      nsp.to(roomId).emit('viewer-joined', { viewerId: socket.id });
    });

    // WebRTC signaling
    socket.on('signal', (data) => {
      const { to, signal } = data || {};
      if (!to || to === socket.id) return;
      nsp.to(to).emit('signal', { from: socket.id, signal });
    });

    // Broadcast chat messages (throttled)
    const sendChat = throttle((roomId, message) => {
      nsp.to(roomId).emit('chat', { from: socket.id, message });
    }, 500);

    socket.on('chat', ({ roomId, message }) => {
      if (!roomId || !message) return;
      sendChat(roomId, message);
    });

    socket.on('disconnect', () => {
      logger.info(`[DISCONNECT] ${socket.id} left ${nsp.name}`);
    });
  });
}
