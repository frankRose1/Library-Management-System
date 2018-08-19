const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const router = require('./routes/index');

const app = express();

//middleware

app.use('/', router);

//error handlers

module.exports = app;