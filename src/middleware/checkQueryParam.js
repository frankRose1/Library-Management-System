/**
 * To be used on the loans and books filter routes
 * if the filter option isn't "overdue" or "checked"
 * send a 404
 */
module.exports = function(req, res, next) {
  if (req.params.query.search(/^(overdue|checked)$/) == -1) {
    res.sendStatus(404);
  } else {
    next();
  }
};
