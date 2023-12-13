const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../auth');
const { verify , verifyAdmin } = auth;

router.post('/', verify, verifyAdmin ,productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/search-by-name', productController.searchProductByName);
router.get('/search-by-price', productController.searchProductByPriceRange);
router.get('/:productId', productController.getProduct);
router.patch('/:productId/archive', productController.archiveProduct);
router.patch('/:productId/activate', productController.activateProduct);


module.exports = router;