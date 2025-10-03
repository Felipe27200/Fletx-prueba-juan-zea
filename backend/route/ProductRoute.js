const express = require('express');
const router = express.Router();
const productController = require('../controller/ProductController');

router.post('/', productController.create);
router.get('/:id', productController.findById);
router.get('/', productController.findAll);
router.put('/:id', productController.update);
router.delete('/:id', productController.deleteById);

module.exports = router;
