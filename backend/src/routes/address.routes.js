import {Router} from 'express'
import Address from '../models/Address.js'
import {auth} from '../middleware/auth.js'
const router=Router()
router.get('/',auth,async(req,res,next)=>{try{res.json({addresses:await Address.find({user:req.user._id}).sort('-isDefault -createdAt')})}catch(e){next(e)}})
router.post('/',auth,async(req,res,next)=>{try{const address=await Address.create({...req.body,user:req.user._id});res.status(201).json({address})}catch(e){next(e)}})
router.delete('/:id',auth,async(req,res,next)=>{try{await Address.deleteOne({_id:req.params.id,user:req.user._id});res.json({success:true})}catch(e){next(e)}})
export default router
