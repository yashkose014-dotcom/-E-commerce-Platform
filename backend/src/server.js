import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import mongoose from 'mongoose'
import authRoutes from './routes/auth.routes.js'
import productRoutes from './routes/product.routes.js'
import categoryRoutes from './routes/category.routes.js'
import orderRoutes from './routes/order.routes.js'
import cartRoutes from './routes/cart.routes.js'
import wishlistRoutes from './routes/wishlist.routes.js'
import addressRoutes from './routes/address.routes.js'
import reviewRoutes from './routes/review.routes.js'
import couponRoutes from './routes/coupon.routes.js'
import adminRoutes from './routes/admin.routes.js'
import notificationRoutes from './routes/notification.routes.js'
import paymentRoutes from './routes/payment.routes.js'

const app = express()
const PORT = process.env.PORT || 5000
const clientOrigin = process.env.CLIENT_URL || 'http://localhost:5173'

app.disable('x-powered-by')
app.use(helmet())
app.use(cors({ origin: clientOrigin, credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false }))

app.get('/api/health', (_req, res) => res.json({ success: true, service: 'urban-mart-api', timestamp: new Date().toISOString() }))
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/addresses', addressRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/coupons', couponRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/payments', paymentRoutes)

app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found' }))
app.use((err, _req, res, _next) => {
  console.error(err)
  if (err?.code === 11000) return res.status(409).json({ success: false, message: 'A record with that value already exists' })
  if (err?.name === 'ValidationError') return res.status(400).json({ success: false, message: Object.values(err.errors).map(e => e.message).join(', ') })
  res.status(err.status || 500).json({ success: false, message: err.message || 'Server error' })
})

mongoose.connect(process.env.MONGODB_URI)
  .then(() => app.listen(PORT, () => console.log(`Urban Mart API running on http://localhost:${PORT}`)))
  .catch((err) => { console.error('MongoDB connection failed:', err.message); process.exit(1) })
