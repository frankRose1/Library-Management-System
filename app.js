const express = require('express');
require('express-async-errors')
const bodyParser = require('body-parser');
const path = require('path');
const router = require('./routes/index');
const {notFound, renderError} = require('./handlers/errorHandlers');

const app = express();

//set the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', router);

app.use(notFound);

app.use(renderError);

module.exports = app;