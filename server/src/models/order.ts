import mongoose from 'mongoose';
import { Types } from 'mongoose';

const orderSchema = new mongoose.Schema({
  products: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  user: {
    name: { type: String, required: true },
    userId: { type: Types.ObjectId, required: true, ref: 'User' },
  },
});

export default mongoose.model('Order', orderSchema);
