/**
 * Catch Errors and render a view to the user
 */

const errorHandlers = {};

//mark the error as a 404 and pass it to the next middleware
errorHandlers.notFound = (req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
};

errorHandlers.renderError = (err ,req, res, next) => {
    res.status(err.status || 500);
    res.render('errorPage', {message: err.message, status: err.status});
};

module.exports = errorHandlers;