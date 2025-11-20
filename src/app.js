import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import routes from './routes/index.js';
import notFound from './middlewares/notFound.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

// Security + performance middlewares
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

// Health check


// Register routes
app.use('/', routes);
app.get("/health", (req, res) => {
  res.send("OK");
});


// 404 & Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
