
const helpers = {};

//To be used on the loans and books filter routes
//if the req.query.param is not "overdue" or "checked" send a 404
helpers.checkQueryParam = (req, res, next) => {
    if (req.params.query.search(/^(overdue|checked)$/) == -1) {
        res.sendStatus(404);
    } else {
        next();
    }
};

module.exports = helpers;