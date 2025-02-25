const express = require('express');

const router = express.Router();

const {
  getProducts,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  deleteProduct,
} = require('../controllers/admin');

router.get('/products', getProducts);
router.post('/add-product', postAddProduct);
router.get('/edit-product/:id', getEditProduct);
router.post('/edit-product', postEditProduct);
router.delete('/delete-product/:id', deleteProduct);

module.exports = router;
