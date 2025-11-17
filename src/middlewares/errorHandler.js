import logger from '../utils/logger.js';

export default (err, req, res, next) => {
  logger.error(err.stack || err.message);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
};
