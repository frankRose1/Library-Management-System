const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const router = require('./routes/index');

const app = express();

//set the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', router);

//error handlers

module.exports = app;