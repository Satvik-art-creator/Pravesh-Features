const errorHandler = (err, req, res, next) => {

  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Server Error';

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? 'Internal Server Error' : message,
  });
};

module.exports = errorHandler;
