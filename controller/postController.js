const asyncHandler=require("express-async-handler");
const Post=require("../../models/posts/post.js");
const User=require("../../models/Users/user.js");
const Category=require("../../models/Categories/category.js");
const post = require("../../models/posts/post.js");

//@desc create a new post
//@route post/api/v1/posts
//@access private

exports.createPost= asyncHandler(
     async(req,resp,next)=>{// async beacause it will be long running task
        //get the payload
    const {title,content,categoryId}=req.body;
    //check if the post id present
    const postFound=await Post.findOne({title:title});
        if(postFound){
            let error=new Error("post already exisiting");
            next(error)
        }

    //create post object
    const post=Post.create(
        {
                title,
                content,
                category:categoryId,
                author:req?.userAuth?._id
        }     
     )
    //update the category by adding post in it
    Category.findByIdAndUpdate(
        categoryId,
        {
            $push:{posts:post._id}//$push(mongoose operator)
        },
        {
            new:true
        }
    )

    //update user by adding post in it
    User.findByIdAndUpdate(
        req?.userAuth?._id,
        {
            $push:{posts:post._id}//$push(mongoose operator)
        },
        {
            new:true
        }
    )

    //send response
  resp.status(201).json(
    {
    status:"success",
    message:"post created successfully",
    post:post,
    user:user,
    catg:catg
    });
});
//@desc GET all post
//@route get/api/v1/posts
//@access private
exports.getAllPosts=asyncHandler(async(req,resp)=>{
  
    //get the currently loggied in user_id
    const currentUserId=req?.userAuth?._id;

    //get all those users who have blocked cureent user
    const usersBlockingCurrentUser=await User.find({
        blockedUsers:currentUserId
    })
      const blockingUserId =usersBlockingCurrentUser.map((userObj)=>userObj._id);

      const query={author:{$nin:blockingUserId},
      $or:[
        {schedulePublish:{$lte:currentDateTime},
        schedulePublish:NULL
       },],} ;

   //fetch those posts whose author is not blockingUserIds
          const allPosts=await posts.find({query}).populate(
            { path:"author",
              model:"User",
              select:"email username role"
            }
          );


      resp.status(201).json(
        {
        status:"success",
        message:"all posts success fully fetched",
        allPosts:allPosts
        });
});
//@desc GET single post
//@route get/api/v1/posts/:id
//@access public
exports.getPosts=asyncHandler(async(req,resp)=>{
    //get the id
      const PostID = req.params.id;
      const post=await Post.findById(PostID);
      resp.status(201).json(
        {
        status:"success",
        message:" post successfully fetched",
        Post:post
        });
});
//@desc delete a post
//@route delete/api/v1/posts/:id
//@access private
exports.deletepost=asyncHandler(async(req,resp)=>{
    //get the id
      const PostID = req.params.id;
      //delete this post FROM DB
      await Post.findByIdAndDelete(PostID);
      resp.status(201).json(
        {
        status:"success",
        message:" post successfully deleted",
        });
});
//@desc UPDATE a post
//@route PUT/api/v1/posts/:id
//@access private
exports.updatePost=asyncHandler(async(req,resp)=>{
    //get the id
      const PostID = req.params.id;
      const {title,content,category}=req.body;
      const updatedPost= Post.findByIdAndUpdate(PostID,
                {title:title,content:content,category:category},
                {new:ture},//return updated document
                {runValidators :ture}//validate the input
              );
      resp.status(201).json(
        {
        status:"success",
        message:"post successfully updated",
        updatedPost,

        });
    
})
//@desc like  post
//@route put/api/v1/posts/like/:postId
//@access private
exports.likePost=asyncHandler(async(req,resp,next)=>{
    //get id of the post
    const currentUserId=req?.userAuth?._id;
    const {postId}=req.params.postId;
    //find the post
    const post=await Post.findById(postId);
    //search the post
    if(!post){
        let err=new Error("post not found");
        next(err);
        return;
    }
    //add the current userid to likes array;
    await Post.findByIdAndUpdate(
        postId,
        {
            $addToSet:{likes:currentUserId}
        },
        {new:true}
    )
  //remove the current userid to likes array;
      post.dislikes=post.dislikes.filter(
       (userId) => userId.toString() !== currentUserId.toString()
      );
      //resave the post
      await post.save();
      
    resp.status(201).json(
        {
        status:"success",
        message:"post successfully liked",
        post:post
        });
  
})
//@desc dislike  post
//@route put/api/v1/posts/unlike/:postId
//@access private
exports.dislikePost=asyncHandler(async(req,resp)=>{
    //get id of the post
    const currentUserId=req?.userAuth?._id;
    const {postId}=req.params.postId;
    //find the post
    const post=await Post.findById(postId);
    //search the post
    if(!post){
        let err=new Error("post not found");
        next(err);
        return;
    }
    //add the current userid to likes array;
    await Post.findByIdAndUpdate(
        postId,
        {
            $addToSet:{dislikes:currentUserId}
        },
        {new:true}
    )
})


//@desc clap a  post
//@route put/api/v1/posts/unlike/:postId
//@access private
exports.clapPost=asyncHandler(async(req,resp,next)=>{
    // get the id of the post
    const {PostID}=req.params;
    //find the post
    const post=await Post.findById(PostID);
    //search the post
    if(!post){
        let err=new Error("post not found");
        next(err);
        return;
    }
    //!implements claps
const updatedPost= Post.findByIdAndUpdate(
    PostID,
    { $inc:{claps:1}},
    {new:true}
      )

    resp.status(201).json(
        {
        status:"success",
        message:"post successfully clapped",
        updatedPost,
        });
})

//@desc schedule a  post
//@route put/api/v1/posts/schedule/:postId
//@access private
exports.schedulePost=asyncHandler(async(req,resp,next)=>{
    // get the id of the post
    const {PostID}=req.params;
    const {schedulePublish}=req.body;
    //ckeck if postId and schedulePublish are provided
    if(!PostID || !schedulePublish){
        let err=new Error("post id and sechedulePublish are required");
        next(err);
        return;
    }
//find the post
    const post=await Post.findById(PostID);
    //search the post
    if(!post){
        let err=new Error("post not found");
        next(err);
        return;
    }
    // check if current user is the author
    if(post.author.toString()!==req?.userAuth?._id.toString()){
        let err=new Error("only author can schedule post");
        next(err);
        return;
    }

    const secheduleDate=new Date(schedulePublish);
    const currentDate=new Date();
    if(secheduleDate<currentDate){
        let err=new Error("schedule date should be greater than current date");
        next(err);
        return;
    }

post.schedulePublish=secheduleDate;

const updatedPost= await post.save();

    resp.status(201).json(
        {
        status:"success",
        message:"post successfully scheduled",
        updatedPost,
        });
    });
