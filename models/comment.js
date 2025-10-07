const mongoose=require("mongoose");
const commentSchema = new mongoose.Schema({
message:{
    type: String,
    required: true
 },
author:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"user",
       required:true
     },
postId:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"post",
       required:true
     },
},{
       
   timestamps:true,// this will add two extra field in mongoDB(created at,update at)

 });

 //converting schema to model

 const comment=mongoose.model("comment",commentSchema);
  module.exports=comment;
