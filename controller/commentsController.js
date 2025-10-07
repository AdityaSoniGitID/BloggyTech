const asyncHandler=require("express-async-handler");
const comment=require("../../models/Comments/comment");
const post=require("../../models/posts/post");
//@desc create a new comment
//@route post/api/v1/comment
//@access private
exports.createComment= asyncHandler(
     async(req,resp,next)=>{// async beacause it will be long running task
        //get the payload
    const {message}=req.body;
    //get the post id
    const postId=req.params.postId;
    //check if the post id present
    const postFound=await post.findById(postId);
        if(!postFound){
            let error=new Error("post not found");
            next(error)
        }
    //create post object
    const comment= await comment.create(
        {
                message,
                postId:postId,
                authorId:req?.userAuth?._id
        }     
     )
      //associate comment with the post
     const post=await post.findByIdAndUpdate(
    postId,
    {
        $push:{comments:comment._id}//$push(mongoose operator)
    },
    {
        new:true
    }
     )
     resp.status(201).json(
        {
        status:"success",
        message:"comment successfully created",
        comment:comment,
        
        });

 })
 //@desc update comment
//@route put/api/v1/comments/:commentId
//@access private
 exports.updateComment=asyncHandler(async(req,resp)=>{
    const commentId=req.params.commentId;
    const {message}=req.body;
    const comment=await comment.findByIdAndUpdate(commentId,{message},{new:true});
    resp.status(201).json(
        {
        status:"success",
        message:"comment successfully updated",
        comment:comment,
        
        });
 })  
 //@desc delete comment
//@route post/api/v1/comments/:commentId
//@access private
 exports.deleteComment=asyncHandler(async(req,resp)=>{
    const commentId=req.params.commentId;
    const comment=await comment.findByIdAndDelete(commentId);
    resp.status(201).json(
        {
        status:"success",
        message:"comment successfully deleted",
        comment:comment,
        
        });
 })

