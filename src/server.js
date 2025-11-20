import dotenv from "dotenv";
dotenv.config(); // must run before importing app or Clerk

import http from 'http';
import cluster from 'cluster';
import os from 'os';
import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import logger from './utils/logger.js';
import { initSockets } from './sockets/index.js';

const PORT = env.PORT || 8080;

async function startServer() {
  await connectDB();
  const server = http.createServer(app);

  // ✅ Initialize Socket.IO and your live namespace
  initSockets(server);

  server.keepAliveTimeout = 61 * 1000;
  server.headersTimeout = 65 * 1000;

  server.listen(PORT, '0.0.0.0', () => {
    logger.info(`🚀 Express server running at :${PORT}`);
  });

  const shutdown = async () => {
    logger.info('🛑 Shutting down...');
    server.close(() => process.exit(0));
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

if (false) {
  const cores = Math.max(1, os.cpus().length - 1);
  logger.info(`Primary ${process.pid} starting ${cores} workers...`);
  for (let i = 0; i < cores; i++) cluster.fork();

  cluster.on('exit', (worker) => {
    logger.warn(`Worker ${worker.process.pid} died — restarting...`);
    cluster.fork();
  });
} else {
  startServer();
}
