import { Router } from 'express'
import Category from '../models/Category.js'
const router = Router()
router.get('/', async (_req, res, next) => {
  try { res.json({ categories: await Category.find().sort('name') }) } catch (e) { next(e) }
})
export default router
