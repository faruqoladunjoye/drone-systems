import Sequelize from 'sequelize';
import logger from './../config/logger.js';
import droneModel from './drone.model.js';
import medicationModel from './medication.model.js';
import batteryLogModel from './batteryLog.model.js';
import droneMedicationModel from './droneMedication.model.js';

const env = process.env;

const db = {};

const sequelizeInstance = new Sequelize(env.DB_DATABASE, env.DB_USER, env.DB_PASSWORD, {
  host: env.DB_HOST,
  dialect: 'postgres',
  port: env.DB_PORT,
  pool: {
    min: 0,
    max: 5,
    acquire: 30000,
    idle: 10000,
  },
  logging: false,
});

sequelizeInstance
  .authenticate()
  .then(() => logger.info('============== DB connected ============='))
  .catch((err) => {
    logger.error('Database connection error:', err);
    process.exit(1);
  });

db.sequelize = sequelizeInstance;
db.Sequelize = Sequelize;

// initialize models
db.drone = droneModel(sequelizeInstance, Sequelize.DataTypes);
db.medication = medicationModel(sequelizeInstance, Sequelize.DataTypes);
db.batteryLog = batteryLogModel(sequelizeInstance, Sequelize.DataTypes);
db.droneMedication = droneMedicationModel(sequelizeInstance, Sequelize.DataTypes);

// Associations
// Many-to-Many: drone <-> medication through droneMedication
db.drone.belongsToMany(db.medication, {
  through: db.droneMedication,
  foreignKey: 'drone_id',
  as: 'medications',
});

db.medication.belongsToMany(db.drone, {
  through: db.droneMedication,
  foreignKey: 'medication_id',
  as: 'drones',
});

// One-to-Many: Drone -> BatteryLog
db.drone.hasMany(db.batteryLog, { foreignKey: 'droneId', onDelete: 'CASCADE' });
db.batteryLog.belongsTo(db.drone, { foreignKey: 'droneId', onDelete: 'CASCADE' });

export default db;
