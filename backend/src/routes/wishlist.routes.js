import {Router} from 'express'
import Wishlist from '../models/Wishlist.js'
import {auth} from '../middleware/auth.js'
const router=Router()
router.get('/',auth,async(req,res,next)=>{try{const wishlist=await Wishlist.findOne({user:req.user._id}).populate('products');res.json({wishlist:wishlist||{products:[]}})}catch(e){next(e)}})
router.put('/',auth,async(req,res,next)=>{try{const wishlist=await Wishlist.findOneAndUpdate({user:req.user._id},{user:req.user._id,products:req.body.products||[]},{upsert:true,new:true}).populate('products');res.json({wishlist})}catch(e){next(e)}})
export default router
