import { Router } from 'express'
import Product from '../models/Product.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const { search, category, minPrice, maxPrice, sort = '-createdAt' } = req.query
    const page = Math.max(1, Number(req.query.page || 1))
    const limit = Math.min(50, Math.max(1, Number(req.query.limit || 24)))
    const filter = {}
    if (search) {
      const safe = String(search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      filter.$or = [{ name: new RegExp(safe, 'i') }, { description: new RegExp(safe, 'i') }]
    }
    if (category) filter.category = category
    if (minPrice || maxPrice) filter.price = { ...(minPrice ? { $gte: Number(minPrice) } : {}), ...(maxPrice ? { $lte: Number(maxPrice) } : {}) }
    const [products, total] = await Promise.all([
      Product.find(filter).populate('category').sort(sort).skip((page - 1) * limit).limit(limit),
      Product.countDocuments(filter),
    ])
    res.json({ products, pagination: { page, limit, total, pages: Math.ceil(total / limit) } })
  } catch (e) { next(e) }
})

router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category')
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json({ product })
  } catch (e) { next(e) }
})

export default router
