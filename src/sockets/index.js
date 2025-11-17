import { Server } from 'socket.io';
import liveSocket from './liveSocket.js';
import logger from '../utils/logger.js';

export function initSockets(server) {
  const io = new Server(server, {
    cors: { origin: process.env.CORS_ORIGIN || '*', methods: ['GET', 'POST'] },
  });

  const liveNs = io.of('/live');
  liveSocket(liveNs);

  logger.info('Socket.IO live namespace initialized');
}
