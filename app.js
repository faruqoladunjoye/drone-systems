import express from 'express';
import cors from 'cors';
import compression from 'compression';
import 'dotenv/config';
import { status as httpStatus } from 'http-status';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import ApiError from './utils/ApiError.js';
import routes from './routes/index.js';
import { successHandler, errorHandlerr } from './config/morgan.js';
import { errorConverter, errorHandler } from './middlewares/error.js';
import db from './models/index.js';
import './worker/battery.scheduler.js';

const app = express();

app.set('trust proxy', 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(successHandler);
app.use(errorHandlerr);
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(compression());

app.use('/api', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Page Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

db.sequelize.sync();

export default app;
