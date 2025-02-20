const Product = require('../models/Product');

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.json(products);
    })
    .catch((err) => {
      console.error(`Error in getIndex: ${err}`);
      res.status(500).json({ error: 'Failed to fetch products on index' });
    });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.json(products);
    })
    .catch((err) => {
      console.error(`Error in getProducts: ${err}`);
      res.status(500).json({ error: 'Failed to fetch products' });
    });
};

exports.getProductDetail = (req, res, next) => {
  const { productId } = req.params;
  Product.findById(productId)
    .then((product) => {
      res.json(product);
    })
    .catch((err) => console.error(`Error in getProductDetail: ${err}`));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((products) => {
      res.json(products);
    })
    .catch((err) => console.error(`Error in getCart: ${err}`));
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  console.log(productId, 'in post cart');
  Product.findById(productId)
    .then((product) => {
    return req.user.addToCart(product);
  }).then(result => {
    console.log(`Result in postCart: ${result}`);
    res.json(result);
  });
};

exports.postCartDeleteItem = (req, res, next) => {
  const { productId } = req.body;
  req.user
    .deleteFromCart(productId)
    .then(result => {
      res.json(result);
    })
    .catch((err) => console.error(`Error in postCartDeleteItem: ${err}`));
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user
        .createOrder()
        .then((order) => {
          return order.addProducts(
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            }),
          );
        })
        .catch((err) =>
          console.error(`Error in add products to order: ${err}`),
        );
    })
    .then((result) => {
      fetchedCart.setProducts(null);
    })
    .then((result) => res.redirect('/orders'))
    .catch((err) => console.error(`Error in postOrder: ${err}`));
};

exports.getOrders = (req, res, next) => {
  req.user
    // eager loading
    .getOrders({ include: ['products'] })
    .then((orders) => {
      res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders',
        orders,
      });
    })
    .catch((err) => {
      console.error(`Error in getOrders: ${err}`);
    });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Your Checkout',
    path: '/checkout',
  });
};
