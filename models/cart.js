const fs = require('fs');
const path = require('path');
const res = require('express/lib/response');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);

module.exports = class Cart {
  // we don't want to recreate the cart every time
  static addProduct(id, price) {
    // fetch the previous cart
    fs.readFile(p, (err, data) => {
      let cart = { products: [], total: 0 };
      if (!err) {
        cart = JSON.parse(data);
      }
      console.log(data, 'data');
      // analyse the cart => find existing product
      const existingProductIndex = cart.products.findIndex(
        (product) => product.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      // increase quantity for existing product
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.quantity = updatedProduct.quantity + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        // add new product to cart
        updatedProduct = { id, quantity: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.total = cart.total + +price;
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, data) => {
      if (err) {
        return console.log(err);
      }
      const updatedCart = { ...JSON.parse(data) };
      const product = updatedCart.products.find((product) => product.id === id);
      if (!product) {
        return;
      }
      updatedCart.products = updatedCart.products.filter(
        (product) => product.id !== id
      );
      updatedCart.total = updatedCart.total - productPrice * product.quantity;

      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      });
    });
  }

  static getCart(cb) {
    fs.readFile(p, (err, data) => {
      const cart = JSON.parse(data);
      if (err) {
        return cb(null);
      } else {
        cb(cart);
      }
    });
  }
};
