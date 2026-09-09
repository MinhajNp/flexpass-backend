import app from './app.js';
import { env } from './config/env.js';
import logger from './utils/logger.js';

app.listen(env.PORT, () => {
  logger.info(`server started on port ${env.PORT}`);
});
