const express=require("express");
const {createPost,getAllPosts,updatePost, getPosts, deletepost, likePost, dislikePost, clapPost, schedulePost,}=require("../../controllers/posts/postController");
const isLOggedIn=require("../../middlewares/isLoggedIn");
const isAccountVerified=require("../../middlewares/isAccountVerified");
const postRouter=express.Router();

//! create post route
postRouter.post("/",isLOggedIn,isAccountVerified,createPost);

//! get all post route
postRouter.get("/",isLOggedIn,getAllPosts);

//! get post route
postRouter.get("/:id",getPosts);

//! delete post route
postRouter.delete("/:id",deletepost);

//! update post route
postRouter.put("/:id",updatePost);

//!  postlike route
postRouter.put("/like/:postId",isLOggedIn,likePost);

//!  post Dislike route
postRouter.put("/dislike/:postId",isLOggedIn,dislikePost);

//!  post claps route
postRouter.put("/claps/:postId",isLOggedIn,clapPost);

//! schduled post route
postRouter.put("/schdule/:postId",isLOggedIn,schedulePost);

module.exports=postRouter;