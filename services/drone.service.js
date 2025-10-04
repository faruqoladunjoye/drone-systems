import { status as httpStatus } from 'http-status';
import ApiError from '../utils/ApiError.js';
import db from '../models/index.js';

// Register new drone
const registerDrone = async (data) => {
  const { serialNumber, model, weightLimit, batteryCapacity } = data;

  const existingDrone = await db.drone.findOne({ where: { serialNumber } });
  if (existingDrone) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Drone with this serial number already exists');
  }

  const drone = await db.drone.create({
    serialNumber,
    model,
    weightLimit,
    batteryCapacity,
    state: 'IDLE',
  });

  return drone;
};

// Load medications onto drone
const loadDrone = async (droneId, medicationCodes) => {
  const drone = await db.drone.findByPk(droneId);
  if (!drone) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Drone not found');
  }

  // check battery
  if (drone.batteryCapacity < 25) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Drone battery too low for loading (<25%)');
  }

  // fetch medications
  const medications = await db.medication.findAll({
    where: { code: { [db.Sequelize.Op.in]: medicationCodes } },
  });

  if (medications.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No valid medications found');
  }

  // calculate total weight
  const totalWeight = medications.reduce((sum, med) => sum + med.weight, 0);
  if (totalWeight > drone.weightLimit) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Total weight ${totalWeight}g Exceeds drone weight limit ${drone.weightLimit}`
    );
  }

  // Start transaction
  const transaction = await db.sequelize.transaction();

  try {
    // Update drone state
    await drone.update({ state: 'LOADING' }, { transaction });

    // Load medications
    for (const medication of medications) {
      await drone.addMedication(medication, { transaction });
    }

    // Update drone state to LOADED
    await drone.update({ state: 'LOADED' }, { transaction });

    await transaction.commit();

    const updatedDrone = await db.drone.findByPk(droneId, {
      include: [{ model: db.medication, as: 'medications', through: { attributes: [] } }],
    });

    return { drone: updatedDrone, totalWeight };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Get loaded medications for a drone
const getLoadedMedications = async (droneId) => {
  const drone = await db.drone.findByPk(droneId, {
    include: [
      {
        model: db.medication,
        as: 'medications',
        through: { attributes: [] },
      },
    ],
  });
  if (!drone) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Drone not found');
  }
  return drone.medications;
};

// Get available drones (idle + battery >= 25%)
const getAvailableDrones = async (page, limit) => {
  page = Number(page) || 1;
  limit = Number(limit) || 10;

  const options = {
    where: {
      state: 'IDLE',
      batteryCapacity: { [db.Sequelize.Op.gte]: 25 },
    },
    attributes: ['id', 'serialNumber', 'model', 'weightLimit', 'batteryCapacity', 'state'],
    offset: (page - 1) * limit,
    limit,
  };

  const drones = await db.drone.findAndCountAll(options);
  const totalPages = Math.ceil(drones.count / limit);

  return {
    drones: drones.rows,
    pagination: {
      page,
      limit,
      totalPages,
    },
  };
};

// Get drone battery level
const getBatteryLevel = async (droneId) => {
  const drone = await db.drone.findByPk(droneId);

  if (!drone) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Drone not found');
  }

  return {
    droneId: drone.id,
    serialNumber: drone.serialNumber,
    batteryCapacity: drone.batteryCapacity,
  };
};

// Periodic task: log all drone battery levels
const logBatteryLevels = async () => {
  const drones = await db.drone.findAll();
  const logs = drones.map((drone) => ({
    droneId: drone.id,
    batteryLevel: drone.batteryCapacity,
  }));
  await db.batteryLog.bulkCreate(logs);
  return logs;
};

export { registerDrone, loadDrone, getLoadedMedications, getAvailableDrones, getBatteryLevel, logBatteryLevels };
