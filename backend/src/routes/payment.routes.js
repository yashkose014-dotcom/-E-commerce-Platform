import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { createPaymentIntent } from '../services/payment.service.js'

const router = Router()

router.post('/intent', auth, async (req, res, next) => {
  try {
    res.json({ payment: await createPaymentIntent(req.body) })
  } catch (error) {
    next(error)
  }
})

export default router
