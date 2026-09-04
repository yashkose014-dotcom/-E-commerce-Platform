import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export async function auth(req, res, next) {
  try {
    const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null
    if (!token) return res.status(401).json({ message: 'Authentication required' })
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(payload.id).select('-passwordHash')
    if (!req.user) return res.status(401).json({ message: 'User not found' })
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export function admin(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Admin access required' })
  next()
}
