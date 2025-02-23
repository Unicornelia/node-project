const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [{
      productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
    }],
  },
});

module.exports = mongoose.model('User', userSchema);

// const { getDb } = require('../config/database');
// const mongodb = require('mongodb');
// const Product = require('./product');
//
// const ObjectId = mongodb.ObjectId;
//
// class User {
//   constructor(name, email, id, cart) {
//     this.name = name;
//     this.email = email;
//     this._id = id ? new ObjectId(id) : null;
//     this.cart = cart;
//   }
//
//   save = async () => {
//     const db = getDb();
//     try {
//       db.collection('users').insertOne(this);
//     } catch (err) {
//       console.error(`Error in creating new user: ${err}`);
//     }
//   };
//
//   addToCart = (product) => {
//     const db = getDb();
//     let newQuantity = 1;
//
//     const cartProductIndex = this.cart.items.findIndex((item) => {
//       return item.productId.toString() === product._id.toString();
//     });
//
//     const isItemAlreadyInCart = cartProductIndex >= 0;
//     const updatedCartItems = [...this.cart.items];
//
//     if (isItemAlreadyInCart) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({ productId: new ObjectId(product._id), quantity: newQuantity });
//     }
//
//     const updatedCart = { items: updatedCartItems };
//     return db.collection('users').updateOne(
//       { _id: new ObjectId(this._id) },
//       { $set: { cart: updatedCart } });
//   };
//
//   getCart = () => {
//     const db = getDb();
//     const productIds = this.cart.items.map(item => {
//       return item.productId;
//     });
//
//     return db.collection('products').find({ _id: { $in: productIds } })
//       .toArray()
//       .then(products => {
//         return products.map(product => {
//           return { ...product, quantity: this.cart.items.find(item => item.productId.toString() === product._id.toString()).quantity };
//         });
//       })
//       .catch((err) => console.error(`Error in getCart: ${err}`));
//   };
//
//   deleteFromCart = (productId) => {
//     const db = getDb();
//     const updatedCartItems = this.cart.items.filter(item => item.productId.toString() !== productId.toString());
//     return db.collection('users').updateOne(
//       { _id: new ObjectId(this._id) },
//       { $set: { cart: { items: updatedCartItems } } });
//   };
//
//   addOrder = () => {
//     const db = getDb();
//     return this.getCart().then(products => {
//       const order = {
//         items: products,
//         user: {
//           _id: new ObjectId(this._id),
//           name: this.name,
//         }
//       }
//       return db.collection('orders').insertOne(order)
//     })
//     .then(result => {
//       this.cart = { items: [] };
//       return db.collection('users').updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: { items: [] } } });
//     });
//   };
//
//   getOrder = () => {
//     const db = getDb();
//     return db.collection('orders').find({'user._id': new ObjectId(this._id)}).toArray();
//   };
//
//   static async findById(id) {
//     const db = getDb();
//     try {
//       return db.collection('users').findOne({ _id: new mongodb.ObjectId(id) });
//     } catch (err) {
//       console.error(`Error in finding user with id: ${id} from DB: ${err}`);
//     }
//   }
// }
//
// module.exports = User;
