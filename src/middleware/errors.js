const notFoundError = (req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
};

const globalErrorHandler = (err ,req, res, next) => {
  res
    .status(err.status || 500)
    .render('errorPage', {message: err.message, status: err.status});
};

exports.notFoundError = notFoundError;
exports.globalErrorHandler = globalErrorHandler;