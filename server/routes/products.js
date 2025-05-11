// routes/products.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');


router.get('/', productController.getProducts);
router.post('/', authMiddleware, productController.addProduct);
router.delete('/:id', authMiddleware, productController.deleteProduct);
router.put('/:id', authMiddleware, productController.updateProduct);

module.exports = router;
