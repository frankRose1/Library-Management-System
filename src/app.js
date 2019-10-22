const express = require('express');
require('express-async-errors');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes');
const {
  notFoundError,
  globalErrorHandler
} = require('./middleware/errors');

const app = express();

//set the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes(app);

app.use(notFoundError);
app.use(globalErrorHandler);

module.exports = app;