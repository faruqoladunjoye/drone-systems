import express from 'express';
import droneRoute from './drone.route.js';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/drones',
    route: droneRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
