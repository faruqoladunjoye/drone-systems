import express from 'express';
import {
  registerDroneHandler,
  loadDroneHandler,
  getLoadedMedicationsHandler,
  getAvailableDronesHandler,
  getBatteryLevelHandler,
} from '../controllers/drone.controller.js';

const router = express.Router();

router.post('/', registerDroneHandler);
router.post('/:id/load', loadDroneHandler);
router.get('/:id/medications', getLoadedMedicationsHandler);
router.get('/available', getAvailableDronesHandler);
router.get('/:id/battery', getBatteryLevelHandler);

export default router;
