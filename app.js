const express = require('express');
require('express-async-errors')
const bodyParser = require('body-parser');
const path = require('path');
const {notFound, renderError} = require('./middleware/errors');

const app = express();

//set the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./routes/index')(app)

app.use(notFound);

app.use(renderError);

module.exports = app;