const express=require("express");
const {createComment, deleteComment, updateComment}=require("../../controllers/Comments/commentsController");
const isLOggedIn=require("../../middlewares/isLoggedIn");
const commentsRouter=express.Router();

//!comments Routes
//create a new comment
commentsRouter.post("/post:id",isLOggedIn,createComment);


//delete a comment
commentsRouter.delete("/:commentId",isLOggedIn,deleteComment);

//update a comment
commentsRouter.put("/:commentId",isLOggedIn,updateComment);

module.exports=commentsRouter;