//import handlers at the top and initlaize the router --> express.Router
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('hello world');
});

module.exports = router;