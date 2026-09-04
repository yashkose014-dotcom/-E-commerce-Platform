import {Router} from 'express'
import Review from '../models/Review.js'
import Product from '../models/Product.js'
import {auth} from '../middleware/auth.js'
const router=Router()
router.get('/product/:productId',async(req,res,next)=>{try{res.json({reviews:await Review.find({product:req.params.productId}).populate('user','name').sort('-createdAt')})}catch(e){next(e)}})
router.post('/',auth,async(req,res,next)=>{try{const review=await Review.create({user:req.user._id,...req.body});const stats=await Review.aggregate([{$match:{product:review.product}},{$group:{_id:null,avg:{$avg:'$rating'},count:{$sum:1}}}]);await Product.findByIdAndUpdate(review.product,{rating:stats[0]?.avg||0,reviewCount:stats[0]?.count||0});res.status(201).json({review})}catch(e){next(e)}})
export default router
