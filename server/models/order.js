const mongoose = require('mongoose');
const { Types } = require('mongoose');

const orderSchema = new mongoose.Schema({
  products: [{
    product: { type: Object, required: true },
    quantity: { type: Number, required: true },
  }],
  user: {
    name: { type: String, required: true },
    userId: { type: Types.ObjectId, required: true, ref: 'User' },
  },
});

module.exports = mongoose.model('Order', orderSchema);