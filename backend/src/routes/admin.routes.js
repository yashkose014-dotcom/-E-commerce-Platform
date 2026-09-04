import { Router } from 'express'
import Product from '../models/Product.js'
import Order from '../models/Order.js'
import User from '../models/User.js'
import Category from '../models/Category.js'
import Coupon from '../models/Coupon.js'
import { auth, admin } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { required, money } from '../utils/validation.js'

const router = Router()
router.use(auth, admin)

router.get('/summary', asyncHandler(async (_req, res) => {
  const [users, orders, products, categories, revenueAgg, pendingOrders, lowStock] = await Promise.all([
    User.countDocuments(),
    Order.countDocuments(),
    Product.countDocuments(),
    Category.countDocuments(),
    Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
    Order.countDocuments({ status: { $in: ['pending', 'confirmed', 'packed'] } }),
    Product.countDocuments({ stock: { $lte: 5 } }),
  ])
  res.json({ users, orders, products, categories, revenue: revenueAgg[0]?.total || 0, pendingOrders, lowStock })
}))

router.get('/products', asyncHandler(async (_req, res) => {
  res.json({ products: await Product.find().populate('category').sort('-createdAt') })
}))

router.post('/products', asyncHandler(async (req, res) => {
  const name = required(req.body.name, 'Product name')
  const price = money(req.body.price, 'Price')
  const product = await Product.create({
    name,
    slug: (req.body.slug || name).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'),
    category: required(req.body.category, 'Category'),
    description: req.body.description || '',
    price,
    stock: Math.max(0, Number(req.body.stock || 0)),
    image: req.body.image || '',
  })
  res.status(201).json({ product })
}))

router.patch('/products/:id', asyncHandler(async (req, res) => {
  const updates = {}
  for (const key of ['name', 'category', 'description', 'image']) if (req.body[key] !== undefined) updates[key] = req.body[key]
  if (req.body.price !== undefined) updates.price = money(req.body.price, 'Price')
  if (req.body.stock !== undefined) updates.stock = Math.max(0, Number(req.body.stock))
  if (updates.name) updates.slug = updates.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
  const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).populate('category')
  if (!product) return res.status(404).json({ message: 'Product not found' })
  res.json({ product })
}))

router.delete('/products/:id', asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id)
  if (!product) return res.status(404).json({ message: 'Product not found' })
  res.json({ message: 'Product deleted' })
}))

router.get('/categories', asyncHandler(async (_req, res) => {
  res.json({ categories: await Category.find().sort('name') })
}))

router.post('/categories', asyncHandler(async (req, res) => {
  const name = required(req.body.name, 'Category name')
  const slug = (req.body.slug || name).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
  res.status(201).json({ category: await Category.create({ name, slug }) })
}))

router.delete('/categories/:id', asyncHandler(async (req, res) => {
  const used = await Product.countDocuments({ category: req.params.id })
  if (used) return res.status(409).json({ message: 'Cannot delete a category that contains products' })
  const category = await Category.findByIdAndDelete(req.params.id)
  if (!category) return res.status(404).json({ message: 'Category not found' })
  res.json({ message: 'Category deleted' })
}))

router.get('/orders', asyncHandler(async (_req, res) => {
  res.json({ orders: await Order.find().populate('user', 'name email').sort('-createdAt') })
}))

router.patch('/orders/:id/status', asyncHandler(async (req, res) => {
  const allowed = ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled']
  if (!allowed.includes(req.body.status)) return res.status(400).json({ message: 'Invalid order status' })
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
  if (!order) return res.status(404).json({ message: 'Order not found' })
  res.json({ order })
}))

router.get('/users', asyncHandler(async (_req, res) => {
  res.json({ users: await User.find().select('-passwordHash').sort('-createdAt') })
}))

router.patch('/users/:id/role', asyncHandler(async (req, res) => {
  if (!['customer', 'admin'].includes(req.body.role)) return res.status(400).json({ message: 'Invalid role' })
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select('-passwordHash')
  if (!user) return res.status(404).json({ message: 'User not found' })
  res.json({ user })
}))

router.get('/coupons', asyncHandler(async (_req, res) => {
  res.json({ coupons: await Coupon.find().sort('-createdAt') })
}))

router.post('/coupons', asyncHandler(async (req, res) => {
  const code = required(req.body.code, 'Coupon code').toUpperCase()
  const type = req.body.type === 'fixed' ? 'fixed' : 'percent'
  const value = money(req.body.value, 'Coupon value')
  const coupon = await Coupon.create({
    code, type, value,
    minOrder: Math.max(0, Number(req.body.minOrder || 0)),
    maxDiscount: req.body.maxDiscount ? Number(req.body.maxDiscount) : undefined,
    expiresAt: req.body.expiresAt || undefined,
    active: req.body.active !== false,
  })
  res.status(201).json({ coupon })
}))

router.delete('/coupons/:id', asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id)
  if (!coupon) return res.status(404).json({ message: 'Coupon not found' })
  res.json({ message: 'Coupon deleted' })
}))

export default router
