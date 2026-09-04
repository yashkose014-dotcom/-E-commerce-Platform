import mongoose from 'mongoose'
const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,
    price: Number,
    quantity: Number
  }],
  subtotal: Number,
  tax: Number,
  shipping: Number,
  discount: { type: Number, default: 0 },
  total: Number,
  status: { type: String, enum: ['pending','confirmed','packed','shipped','delivered','cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending','paid','failed','refunded'], default: 'pending' },
  shippingAddress: {
    name: String, phone: String, line1: String, city: String, state: String, postalCode: String, country: String
  }
}, { timestamps: true })
export default mongoose.model('Order', schema)
