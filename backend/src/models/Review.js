import mongoose from 'mongoose'
const schema = new mongoose.Schema({ user:{type:mongoose.Schema.Types.ObjectId,ref:'User'}, product:{type:mongoose.Schema.Types.ObjectId,ref:'Product'}, rating:{type:Number,min:1,max:5,required:true}, title:String, comment:String }, {timestamps:true})
schema.index({user:1,product:1},{unique:true})
export default mongoose.model('Review',schema)
