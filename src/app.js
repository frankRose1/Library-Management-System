const express = require('express');
const parser = require('body-parser');
const path = require('path');
const routes = require('./routes');
const {
  notFoundError,
  globalErrorHandler
} = require('./middleware/errors');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

routes(app);

app.use(notFoundError);
app.use(globalErrorHandler);

module.exports = app;