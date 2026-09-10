import app from './app.js';
import connectDB from './config/database.js';
import { env } from './config/env.js';
import logger from './utils/logger.js';

const startServer = async (): Promise<void> => {
  connectDB();

  app.listen(env.PORT, () => {
    logger.info(`server started on port ${env.PORT}`);
  });
};

startServer();
