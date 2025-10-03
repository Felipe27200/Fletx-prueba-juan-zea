const express = require('express');
const router = express.Router();
const productController = require('../controller/ProductController');

router.post('/', productController.create);
router.get('/:id', productController.findById);
router.put('/:id', productController.update);

module.exports = router;
