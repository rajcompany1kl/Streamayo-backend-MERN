import rateLimit from 'express-rate-limit';

export default rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,                 // limit per IP
  standardHeaders: true,
  legacyHeaders: false
});
