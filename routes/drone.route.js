import express from 'express';
import validate from '../middlewares/validate.js';
import {
  registerDroneHandler,
  loadDroneHandler,
  getLoadedMedicationsHandler,
  getAvailableDronesHandler,
  getBatteryLevelHandler,
} from '../controllers/drone.controller.js';
import {
  registerDrone,
  loadDrone,
  getLoadedMedications,
  getAvailableDrones,
  getBatteryLevel,
} from '../validations/drone.validation.js';

const router = express.Router();

router.post('/', validate(registerDrone), registerDroneHandler);
router.post('/:id/load', validate(loadDrone), loadDroneHandler);
router.get('/:id/medications', validate(getLoadedMedications), getLoadedMedicationsHandler);
router.get('/available', validate(getAvailableDrones), getAvailableDronesHandler);
router.get('/:id/battery', validate(getBatteryLevel), getBatteryLevelHandler);

export default router;
