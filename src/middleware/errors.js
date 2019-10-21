const notFound = (req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
};

const renderError = (err ,req, res, next) => {
    res.status(err.status || 500);
    res.render('errorPage', {message: err.message, status: err.status});
};

exports.notFound = notFound;
exports.renderError = renderError;