//import handlers at the top and initlaize the router --> express.Router
const express = require('express');
const router = express.Router();
const patronHandlers = require('../handlers/patronHandlers');

//patron routes
router.get('/', patronHandlers.patronDetails);

module.exports = router;