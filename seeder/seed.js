import logger from '../config/logger.js';
import db from '../models/index.js';

const dronesData = [
  {
    serialNumber: 'DRONE001',
    model: 'Cruiserweight',
    weightLimit: 400,
    batteryCapacity: 100,
    state: 'IDLE',
  },
  {
    serialNumber: 'DRONE002',
    model: 'Middleweight',
    weightLimit: 300,
    batteryCapacity: 90,
    state: 'IDLE',
  },
  {
    serialNumber: 'DRONE003',
    model: 'Lightweight',
    weightLimit: 200,
    batteryCapacity: 80,
    state: 'IDLE',
  },
  {
    serialNumber: 'DRONE004',
    model: 'Heavyweight',
    weightLimit: 500,
    batteryCapacity: 75,
    state: 'IDLE',
  },
  {
    serialNumber: 'DRONE005',
    model: 'Lightweight',
    weightLimit: 200,
    batteryCapacity: 6,
    state: 'IDLE',
  },
  {
    serialNumber: 'DRONE006',
    model: 'Cruiserweight',
    weightLimit: 350,
    batteryCapacity: 50,
    state: 'IDLE',
  },
  {
    serialNumber: 'DRONE007',
    model: 'Heavyweight',
    weightLimit: 450,
    batteryCapacity: 40,
    state: 'IDLE',
  },
  {
    serialNumber: 'DRONE008',
    model: 'Cruiserweight',
    weightLimit: 320,
    batteryCapacity: 30,
    state: 'IDLE',
  },
  {
    serialNumber: 'DRONE009',
    model: 'Middleweight',
    weightLimit: 250,
    batteryCapacity: 25,
    state: 'IDLE',
  },
  {
    serialNumber: 'DRONE010',
    model: 'Heavyweight',
    weightLimit: 410,
    batteryCapacity: 10,
    state: 'IDLE',
  },
];

const medicationsData = [
  {
    name: 'Paracetamol-500',
    weight: 50,
    code: 'PARA_500',
    image: 'https://dummyimage.com/100x100/000/fff&text=PARA500',
  },
  {
    name: 'Amoxicillin-250',
    weight: 30,
    code: 'AMOX_250',
    image: 'https://dummyimage.com/100x100/000/fff&text=AMOX250',
  },
  {
    name: 'Ibuprofen_200',
    weight: 20,
    code: 'IBU_200',
    image: 'https://dummyimage.com/100x100/000/fff&text=IBU200',
  },
  {
    name: 'Vitamin-C_1000',
    weight: 10,
    code: 'VITC_1000',
    image: 'https://dummyimage.com/100x100/000/fff&text=VITC1000',
  },
  {
    name: 'Azithromycin-500',
    weight: 40,
    code: 'AZI_500',
    image: 'https://dummyimage.com/100x100/000/fff&text=AZI500',
  },
  {
    name: 'Insulin_Inj_10ml',
    weight: 100,
    code: 'INSULIN_10ML',
    image: 'https://example.com/images/insulin.jpg',
  },
  {
    name: 'Ciprofloxacin_250',
    weight: 40,
    code: 'CIPRO_250',
    image: 'https://example.com/images/cipro.jpg',
  },
  {
    name: 'Metformin_500',
    weight: 35,
    code: 'METFORMIN_500',
    image: 'https://example.com/images/metformin.jpg',
  },
  {
    name: 'Lisinopril_10',
    weight: 20,
    code: 'LISINO_10',
    image: 'https://example.com/images/lisinopril.jpg',
  },
  {
    name: 'Prednisone-20',
    weight: 15,
    code: 'PRED_20',
    image: 'https://example.com/images/prednisone.jpg',
  },
];

async function seed() {
  try {
    await db.sequelize.sync({ force: true });

    await db.drone.bulkCreate(dronesData);
    logger.info('Drone seeded!');

    await db.medication.bulkCreate(medicationsData);
    logger.info('Medications seeded!');

    process.exit(0);
  } catch (err) {
    logger.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
