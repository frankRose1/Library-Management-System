module.exports = function(
  message = 'Something went horribly wrong!',
  status = 500
) {
  const error = new Error(message);
  error.status = status;
  throw error;
};
