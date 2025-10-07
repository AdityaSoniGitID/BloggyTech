const mongoose=require("mongoose");
const categorySchema = new mongoose.Schema({
name:{
    type: String,
    required: true
 },
  author:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"user",
       required:true
     },
 shares:{
        type:Number,
        default:0
 },
post:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"post"
}]
},{
       
   timestamps:true,// this will add two extra field in mongoDB(created at,update at)
    toJSON:{
    virtuals:true
   },
   toObject:{
     virtuals: true
   }
 });

 //converting schema to model

 const category=mongoose.model("category",categorySchema);
  module.exports=category;
