import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import Category from '../models/Category.js'
import Product from '../models/Product.js'
import Coupon from '../models/Coupon.js'

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  await Promise.all([User.deleteMany({}), Category.deleteMany({}), Product.deleteMany({}), Coupon.deleteMany({})])

  const categories = await Category.insertMany([
    { name: 'Fashion', slug: 'fashion' },
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Lifestyle', slug: 'lifestyle' },
  ])
  const categoryBySlug = Object.fromEntries(categories.map(c => [c.slug, c._id]))

  await Product.insertMany([
    { name: 'Aero Wireless Headphones', slug: 'aero-wireless-headphones', category: categoryBySlug.electronics, price: 2999, stock: 40, rating: 4.8, reviewCount: 126, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&q=80', description: 'Comfortable wireless headphones with immersive sound.' },
    { name: 'Minimal Everyday Backpack', slug: 'minimal-everyday-backpack', category: categoryBySlug.fashion, price: 1899, stock: 25, rating: 4.6, reviewCount: 84, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&q=80', description: 'A clean, durable everyday backpack.' },
    { name: 'Smart Watch Pro', slug: 'smart-watch-pro', category: categoryBySlug.electronics, price: 4999, stock: 18, rating: 4.7, reviewCount: 211, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80', description: 'Fitness tracking and notifications in a lightweight design.' },
    { name: 'Urban Runner Sneakers', slug: 'urban-runner-sneakers', category: categoryBySlug.fashion, price: 2499, stock: 30, rating: 4.5, reviewCount: 73, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80', description: 'Lightweight everyday sneakers built for city life.' },
    { name: 'Ceramic Desk Mug', slug: 'ceramic-desk-mug', category: categoryBySlug.lifestyle, price: 599, stock: 60, rating: 4.4, reviewCount: 45, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=900&q=80', description: 'Minimal ceramic mug for coffee, tea and your desk.' },
    { name: 'Portable Desk Lamp', slug: 'portable-desk-lamp', category: categoryBySlug.lifestyle, price: 1299, stock: 22, rating: 4.6, reviewCount: 38, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&q=80', description: 'Warm adjustable lighting for focused work.' },
  ])

  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'ChangeMe123!', 12)
  await User.create({ name: 'Urban Mart Admin', email: process.env.ADMIN_EMAIL || 'admin@urbanmart.local', passwordHash, role: 'admin' })
  await Coupon.create({ code: 'WELCOME10', type: 'percent', value: 10, maxDiscount: 500, minOrder: 999, active: true })

  console.log('Urban Mart database seeded successfully.')
  console.log(`Admin: ${process.env.ADMIN_EMAIL || 'admin@urbanmart.local'}`)
  await mongoose.disconnect()
}
run().catch(err => { console.error(err); process.exit(1) })
