import {Router} from 'express'
import Coupon from '../models/Coupon.js'
const router=Router()
router.post('/validate',async(req,res,next)=>{try{const {code,subtotal}=req.body;const c=await Coupon.findOne({code:code?.toUpperCase(),active:true});if(!c||c.expiresAt&&c.expiresAt<new Date()||subtotal<c.minOrder)return res.status(400).json({message:'Invalid or expired coupon'});let discount=c.type==='percent'?subtotal*c.value/100:c.value;if(c.maxDiscount)discount=Math.min(discount,c.maxDiscount);res.json({valid:true,discount})}catch(e){next(e)}})
export default router
