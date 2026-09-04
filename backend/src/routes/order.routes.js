import { Router } from 'express'
import mongoose from 'mongoose'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import Coupon from '../models/Coupon.js'
import { auth } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { positiveInt, required } from '../utils/validation.js'

const router = Router()

router.get('/', auth, asyncHandler(async (req, res) => {
  res.json({ orders: await Order.find({ user: req.user._id }).populate('items.product').sort('-createdAt') })
}))

router.get('/:id', auth, asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id }).populate('items.product')
  if (!order) return res.status(404).json({ message: 'Order not found' })
  res.json({ order })
}))

router.post('/', auth, asyncHandler(async (req, res) => {
  const { items, shippingAddress, couponCode } = req.body
  required(shippingAddress?.name, 'Shipping name')
  required(shippingAddress?.phone, 'Shipping phone')
  required(shippingAddress?.line1, 'Shipping address')
  required(shippingAddress?.city, 'City')
  required(shippingAddress?.postalCode, 'Postal code')
  if (!Array.isArray(items) || !items.length) return res.status(400).json({ message: 'Order items are required' })

  const session = await mongoose.startSession()
  try {
    let created
    await session.withTransaction(async () => {
      const orderItems = []
      let subtotal = 0

      for (const item of items) {
        const quantity = positiveInt(item.quantity, 'Quantity')
        const product = await Product.findById(item.product).session(session)
        if (!product) {
          const error = new Error('One or more products no longer exist'); error.status = 400; throw error
        }
        if (product.stock < quantity) {
          const error = new Error(`${product.name} has only ${product.stock} item(s) left`); error.status = 400; throw error
        }
        await Product.updateOne({ _id: product._id, stock: { $gte: quantity } }, { $inc: { stock: -quantity } }).session(session)
        orderItems.push({ product: product._id, name: product.name, price: product.price, quantity })
        subtotal += product.price * quantity
      }

      let discount = 0
      if (couponCode) {
        const coupon = await Coupon.findOne({ code: String(couponCode).toUpperCase(), active: true }).session(session)
        if (!coupon || (coupon.expiresAt && coupon.expiresAt < new Date())) {
          const error = new Error('Coupon is invalid or expired'); error.status = 400; throw error
        }
        if (subtotal < coupon.minOrder) {
          const error = new Error(`Minimum order for this coupon is ₹${coupon.minOrder}`); error.status = 400; throw error
        }
        discount = coupon.type === 'percent' ? subtotal * coupon.value / 100 : coupon.value
        if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount)
        discount = Math.min(discount, subtotal)
      }

      const tax = Math.round((subtotal - discount) * 0.18 * 100) / 100
      const shipping = subtotal - discount >= 999 ? 0 : 99
      const total = Math.max(0, Math.round((subtotal - discount + tax + shipping) * 100) / 100)

      created = await Order.create([{
        user: req.user._id, items: orderItems, subtotal, tax, shipping, discount, total,
        shippingAddress, paymentStatus: 'pending', status: 'pending',
      }], { session })
      created = created[0]
    })
    res.status(201).json({ order: created })
  } finally {
    await session.endSession()
  }
}))

export default router
