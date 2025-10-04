import { status as httpStatus } from 'http-status';
import { response } from '../utils/response-wrapper.js';
import catchAsync from '../utils/catchAsync.js';
import {
  registerDrone,
  loadDrone,
  getLoadedMedications,
  getAvailableDrones,
  getBatteryLevel,
} from '../services/drone.service.js';

const registerDroneHandler = catchAsync(async (req, res) => {
  const droneData = req.body;
  const drone = await registerDrone(droneData);
  res.status(httpStatus.CREATED).json(response('Drone registered successfully', true, drone));
});

const loadDroneHandler = catchAsync(async (req, res) => {
  const { medicationCodes } = req.body;
  const droneId = req.params.id;
  const droneData = await loadDrone(droneId, medicationCodes);
  res.status(httpStatus.OK).json(response('Drone Loaded successfully', true, droneData));
});

const getLoadedMedicationsHandler = catchAsync(async (req, res) => {
  const droneId = req.params.id;
  const meds = await getLoadedMedications(droneId);
  res.status(httpStatus.OK).json(response('Medications fetched successfully', true, meds));
});

const getAvailableDronesHandler = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const drones = await getAvailableDrones(page, limit);
  res.status(httpStatus.OK).json(drones);
});

const getBatteryLevelHandler = catchAsync(async (req, res) => {
  const droneId = req.params.id;
  const battery = await getBatteryLevel(droneId);
  res.status(httpStatus.OK).json(response('Battery level fetched successfully', true, battery));
});

export {
  registerDroneHandler,
  loadDroneHandler,
  getLoadedMedicationsHandler,
  getAvailableDronesHandler,
  getBatteryLevelHandler,
};
