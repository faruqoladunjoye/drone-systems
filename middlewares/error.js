import { status as httpStatus } from 'http-status';
import logger from '../config/logger.js';
import ApiError from '../utils/ApiError.js';
import Sequelize from 'sequelize';

const env = process.env;

const errorConverter = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const isSequelizeError = error instanceof Sequelize.BaseError;

    const isClientError =
      error instanceof Sequelize.ValidationError ||
      error instanceof Sequelize.UniqueConstraintError ||
      error instanceof Sequelize.ForeignKeyConstraintError;

    const statusCode =
      error.statusCode || (isSequelizeError && isClientError ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR);

    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  if (env.NODE_ENV === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  if (env.NODE_ENV === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

export { errorConverter, errorHandler };
