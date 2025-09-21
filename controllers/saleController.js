const express = require('express');
const router = express.Router();
const { sell } = require('../services/saleService');

router.post('/', sell);

module.exports = router;
