import {Router} from 'express'
import Cart from '../models/Cart.js'
import {auth} from '../middleware/auth.js'
const router=Router()
router.get('/',auth,async(req,res,next)=>{try{const cart=await Cart.findOne({user:req.user._id}).populate('items.product');res.json({cart:cart||{user:req.user._id,items:[]}})}catch(e){next(e)}})
router.put('/',auth,async(req,res,next)=>{try{const cart=await Cart.findOneAndUpdate({user:req.user._id},{user:req.user._id,items:req.body.items||[]},{upsert:true,new:true}).populate('items.product');res.json({cart})}catch(e){next(e)}})
export default router
