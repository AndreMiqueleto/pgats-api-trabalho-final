const express = require('express');
const router = express.Router();
const productService = require('../services/productService');

router.post('/register', productService.register);
router.get('/', productService.list);

module.exports = router;
