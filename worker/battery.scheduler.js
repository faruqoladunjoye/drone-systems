import cron from 'node-cron';
import { logBatteryLevels } from '../services/drone.service.js';
import logger from '../config/logger.js';

// Run every 10 minutes
cron.schedule('*/10 * * * *', async () => {
  logger.info('Checking drone battery levels...');
  try {
    const logs = await logBatteryLevels();
    logger.info(`Logged battery levels for ${logs.length} drones`);
  } catch (err) {
    logger.error('Error logging battery levels:', err.message);
  }
});
