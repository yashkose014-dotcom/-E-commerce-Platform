import {Router} from 'express'
import Notification from '../models/Notification.js'
import {auth} from '../middleware/auth.js'
const router=Router()
router.get('/',auth,async(req,res,next)=>{try{res.json({notifications:await Notification.find({user:req.user._id}).sort('-createdAt')})}catch(e){next(e)}})
router.patch('/:id/read',auth,async(req,res,next)=>{try{res.json({notification:await Notification.findOneAndUpdate({_id:req.params.id,user:req.user._id},{read:true},{new:true})})}catch(e){next(e)}})
export default router
