const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const port = process.env.PORT || 3000;
const router = require('./routes/index');

const app = express();

app.use('/', router);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;