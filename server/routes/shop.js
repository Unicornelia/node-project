const express = require('express');

const router = express.Router();

const {
  getIndex,
  getProducts,
  getProductDetail,
  getCart,
  postCart,
  postCartDeleteItem,
  getOrders,
  postOrder,
} = require('../controllers/shop');

router.get('/', getIndex);
router.get('/products', getProducts);
router.get('/products/:productId', getProductDetail);
router.get('/cart', getCart);
router.post('/cart', postCart);
router.post('/cart-delete-item', postCartDeleteItem);
router.post('/create-order', postOrder);
router.get('/orders', getOrders);

module.exports = router;
