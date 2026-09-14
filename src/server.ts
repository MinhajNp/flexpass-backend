import app from './app.js';
import connectDB from './config/database.js';
import { env } from './config/env.js';
import logger from './utils/logger.js';

class Server {
  // ==============================
  // START SERVER
  // ==============================

  public async start(): Promise<void> {
    await connectDB();

    app.listen(env.PORT, () => {
      logger.info(`server started on port ${env.PORT}`);
    });
  }
}

const server = new Server();

server.start();
