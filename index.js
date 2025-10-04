import app from './app.js';
import logger from './config/logger.js';

const env = process.env;
const port = env.PORT || 3000;

const server = app.listen(port, async () => {
  logger.info(`Listening on port ${port}`);
});

// graceful shutdown
const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

process.on('uncaughtException', (err) => {
  logger.error({ err }, 'uncaughtException');
  exitHandler();
});
process.on('unhandledRejection', (err) => {
  logger.error({ err }, 'unhandledRejection');
  exitHandler();
});
process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  exitHandler();
});
