import mongoose from 'mongoose'
const schema = new mongoose.Schema({ user:{type:mongoose.Schema.Types.ObjectId,ref:'User'}, name:String, phone:String, line1:String, city:String, state:String, postalCode:String, country:{type:String,default:'India'}, isDefault:{type:Boolean,default:false} }, {timestamps:true})
export default mongoose.model('Address',schema)
