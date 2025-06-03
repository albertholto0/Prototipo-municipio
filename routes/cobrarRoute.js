const express = require('express');
const Cobrar = require('../models/cobrarModel');
const router = express.Router();

router.get('/', Cobrar.getContribuyente);

module.exports = router;