const request = require('supertest');

/**
 * Execute a GET request against the server
 * @param {Object} server - Running server instance to make requests against
 * @param {String} url - Url string
 *
 * @return {Promise} Promise result from supertest's get() method
 */
const execGet = (server, url) => request(server).get(url);

/**
 * Execute a POST request against the server
 * @param {Object} server - Running server instance to make requests against
 * @param {String} url - Url string
 * @param {Object} data - Data to send along in the request body
 *
 * @return {Promise} Promise result from supertest's post() method
 */
const execPost = (server, url, data) =>
  request(server)
    .post(url)
    .send(data);

exports.execGet = execGet;
exports.execPost = execPost;
