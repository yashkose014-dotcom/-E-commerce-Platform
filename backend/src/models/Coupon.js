import mongoose from 'mongoose'
const schema = new mongoose.Schema({ code:{type:String,unique:true,uppercase:true,trim:true}, type:{type:String,enum:['percent','fixed'],default:'percent'}, value:{type:Number,min:0}, minOrder:{type:Number,default:0}, maxDiscount:Number, expiresAt:Date, active:{type:Boolean,default:true} }, {timestamps:true})
export default mongoose.model('Coupon',schema)
