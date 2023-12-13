const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../auth');
const { verify , verifyAdmin } = auth;

router.get('/', verify, cartController.getUserCart);
router.post('/add-to-cart', verify, cartController.addToCart);
router.patch('/change-quantity', verify, cartController.changeCartQuantity)
router.delete('/remove-product', verify, cartController.removeProduct)
router.delete('/clear-product', verify, cartController.clearProducts)

module.exports = router;