import Joi from 'joi';

const registerDrone = {
  body: Joi.object().keys({
    serialNumber: Joi.string().max(100).required(),
    weightLimit: Joi.number().integer().min(1).max(500).required(),
    batteryCapacity: Joi.number().integer().min(0).max(100).required(),
  }),
};

const loadDrone = {
  params: Joi.object().keys({
    id: Joi.string().guid({ version: 'uuidv4' }).required(),
  }),
  body: Joi.object().keys({
    medicationCodes: Joi.array().items(
      Joi.string()
        .pattern(/^[A-Z0-9_]+$/)
        .required()
        .min(1)
        .required()
    ),
  }),
};

const getLoadedMedications = {
  params: Joi.object().keys({
    id: Joi.string().guid({ version: 'uuidv4' }).required(),
  }),
};

const getAvailableDrones = {
  query: Joi.object().keys({
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getBatteryLevel = {
  params: Joi.object().keys({
    id: Joi.string().guid({ version: 'uuidv4' }).required(),
  }),
};

export { registerDrone, loadDrone, getLoadedMedications, getAvailableDrones, getBatteryLevel };
