const mongoose=require("mongoose");
const postSchema = new mongoose.Schema({
title:{
    type: String,
    required: true
 },
 image:{
    type: String,
    default:""
 },
 claps:{
         type:Number,
         default:0,
       },
 content:{
     type:String,
     required:true
 },
 author:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"user"
     },
 shares:{
         type:Number,
         default:0,
 },
 postViews:{
           type:Number,
           default:0,
 },
 categoires:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"category",
    require:true
 },
 scheduledPublished:{
     type: Date,
     default:null
 },
likes:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
}],
dislikes:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
}],
comments:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"comment"
}],

},{
       
   timetamps:true,// this will add two extra field in mongoDB(created at,update at)
   toJSON:{
    virtuals:true
   },
   toObject:{
     virtuals: true
   }
 });

 //converting schema to model

 const post=mongoose.model("post",postSchema);
  module.exports=post;
