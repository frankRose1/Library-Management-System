const app = require('../../app');
const models = require('../../models');

/**
 * Will close the server and clear the database
 * @param {object} server Instance of the express server to be closed
 */
const tearDownApp = async server => {
  await Promise.all(
    Object.keys(models).map(key => {
      if (['sequelize', 'Sequelize'].includes(key)) return null;

      return models[key].destroy({ where: {}, force: true });
    })
  );
  await server.close();
};

/**
 * Syncs the database models and starts the express app
 * @param {integer} port  Port to run the express app on. defaults to 5000
 *
 * @return {object} instance of the express server
 */
const initApp = async (port = 5000) => {
  await models.sequelize.sync();
  const server = app.listen(port, () =>
    console.log(`Server is listening on ${port}`)
  );
  return server;
};

exports.initApp = initApp;
exports.tearDownApp = tearDownApp;
