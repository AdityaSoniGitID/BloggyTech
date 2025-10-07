const { json, response } = require("express");
const bcrypt=require("bcryptjs");
const asyncHandler=require("express-async-handler");
const user=require("../../models/Users/user");
const generateToken=require("../../utils/generateJsonToken");
const sendEmail = require("../../utils/sendEmail");
const crypto=require("crypto");
const { model } = require("mongoose");

//@desc register new user
//@route post/api/v1/users/register
//@access public
exports.register= asyncHandler(
   async(req,resp,next)=>{// async beacause it will be long running task
            const{username,password,email}=req.body;
            const user= await user.findOne({username});
            if(user){
               throw new Error("user already exist");
            }
            const newUser= new user({username,email,password});// now its become

            //! Hashing password
            const salt=await bcrypt.genSalt("10");
            newUser.password=await bcrypt.hash(password, salt);

            await newUser.save();
            resp.json({
                        message:"user register successfully",
                        status:"success",
                        _id:newUser?.id, // *****optional chaining*****
                        username:newUser?.username,
                        email:newUser?.email,
                        role:newUser?.role,
                        });
   }
);
//@desc login new user
//@route post/api/v1/users/login
//@access public
exports.login= asyncHandler(
   async(req,resp,next)=>{
   const {username,password}=req.body;
   const user= await user.findOne({username});
      if(!user){
         throw new Error("Invalid credentials");
      }
           let isMatched= await bcrypt.compare(password,user?.password);
      if(!isMatched){
         throw new Error("Invalid credentials");
      }
         user.lastlogin=new Date;
         await user.save();
         resp.json({
                  status:"success",
                  email:user?.email,
                  _id:user?._id,
                  username:user?.username,
                  role:user?.role,
                  token:generateToken(user)
                });
   });
//@desc profile view
//@route post/api/v1/users/profile/:id
//@access private
exports.getProfile= asyncHandler(async(req,resp,next)=>
{      
        const user = user.findByid(req.userAuth.id).populate({
          path:"posts",
          model:"post",
        }).populate({ path:"following", model:"user"})
          .populate({ path:"followers", model:"user"})
          .populate({ path:"blockedUsers", model:"user"})
          .populate({ path:"profileViewer", model:"user"});
        if(!user){
           let err= new Error("user whose profile is to be viewed not found");
            next(err);
        }
        resp.json({
                     status:"success",
                     message:"profile fetched",
                     user,//user:user=user 
                   });
})

//@desc blockuser
//@route put/api/v1/users/block/userIdToBlock
//@access public
exports.blockUser= asyncHandler(async(req,resp,next)=>
{      // find the user id to be block
        const userIdToBlock = req.params.userIdToBlock;
        //check if the user id present
        const userToblock=await user.findById(userIdToBlock);
        if(!userToblock){
           let err= new Error("user to block not found");
            next(err);
        }
        //get the current user id
        const userBlocking=req?.userAuth?.id;

        //check if is the self blocking
        if(userIdToBlock.toString()===userBoking.toString()){
           let err = new Error("cannot block yourself");
            next(err);
            return;
        }
        
        //get the cureent user object from the DB
        const currentUser=await user.findById(userBlocking);

         // check wheater userIdToBlock is already block
        if(currentUser.blockedUsers.includes(userIdToBlock)){
           let err= new Error("user already being   blocked");
            next(err);
            return;
        }
        else{
           //push the user id to blockedUsers array
           currentUser.blockedUsers.push(userIdToBlock);
           await currentUser.save();
        } 

        resp.json({
                     status:"success",
                     message:"user block successfully",
                     user,//user:user=user 
                   });
})

//@desc unblockuser
//@route put/api/v1/users/unBlock/:userIdToUnblock
//@access private
exports.unblockUser= asyncHandler(async(req,resp,next)=>
{      // find the user id to be block
        const userIdToUnblock = req.params.userIdToUnblock;
        //check if the user id present
        const userToUnblock=await user.findById(userIdToUnblock);
        if(!userToUnblock){
           let err= new Error("user to unblock not found");
            next(err);
            return;
        }
        //get the current user id
        const userUnblocking=req?.userAuth?.id;

         //get the cureent user object from the DB
        const currentUser=await user.findById(userUnblocking);

        //check if is the self blocking
        if(userIdToUnblock.toString()===userUnblocking.toString()){
           let err = new Error("cannot unblock yourself");
            next(err);
        }

         // check wheater userIdToUnblock is already block
        if(!currentUser.blockedUsers.includes(userIdToUnblock)){//includes
           let err= new Error("user not blocked");
            next(err);
            return;
        }
        else{
           // (remove)push the user id to blockedUsers array
          currentUser.blockedUsers.filter((id)=>{
            return id.toString()!==userIdToUnblock.toString()});//filter

           //currentUser.blockedUsers.pull(userIdToUnblock);//pull
           await currentUser.save();//update the data base
        } 

        resp.json({
                     status:"success",
                     message:"user unblock successfully",
                     user,//user:user=user 
                   });
        });
//! view profile user
//@desc view another user profile
//@route get/api/v1/users/view/:userProfileId
//@access private 
exports.viewAthorProfile= asyncHandler(async(req,resp,next)=>
{      
        const userProfileId = req.params.userProfileId;
        const userProfile=await user.findById(userProfileId);
         if(!userProfile){//includes
           let err= new Error("user whose profile is to be viewed not found");
            next(err);
            return;
        }
        const currentUserId=req?.userAuth?.id;
        // check if we have already viewd the profile of userProfile
        if(userProfile.profileViewer.includes(currentUserId)){//includes
           let err= new Error("you have already viewed this profile");
            next(err);
            return;
        }
        // push the currentUserId to profileViewer array
        userProfile.profileViewer.push(currentUserId);
        await userProfile.save();
        resp.json({
                     status:"success",
                     message:"profile fetched",
                     userProfile:userProfile
                   });
})
//@desc follow user
//@route put/api/v1/users/following/:userProfileId to follow
//@access private 
exports.followingUser= asyncHandler(async(req,resp,next)=>
{      
        const userIdTofollow = req.params.userIdTofollow;
        const currentUserId=req?.userAuth?.id;
        const userProfile=await user.findById(userIdTofollow);
         if(!userProfile){
           let err= new Error("user not found");
            next(err);
            return;
        }
        // avoid current user to follow self
        if(userIdTofollow.toString()===currentUserId.toString()){
           let err = new Error("cannot follow yourself");
            next(err);
            return;
        }
        // check if we have already followed the user
        if(userProfile.followers.includes(currentUserId)){//includes
           let err= new Error("you have already followed this user");
            next(err);
            return;
        }
        //push the id to of userTOFollow inside the follwing array of current user
        await user.findByIdAndUpdate(
         currentUserId,
         {  $addToSet:{
                      following:userIdTofollow
                      }
          },
          { new:true }
         );//!addTOSet
       
        resp.json({
                     status:"success",
                     message:"user followed successfully",
                     userProfile:userProfile
                   });
})
//@desc unfollow user
//@route put/api/v1/users/unfollowing/:userProfileId to unfollow
//@access private 
exports.unfollowingUser= asyncHandler(async(req,resp,next)=>
{      
        const userIdTounfollow = req.params.userIdTounfollow;
        const currentUserId=req?.userAuth?.id;//get the current user id from the client
        const userProfile=await user.findById(userIdTounfollow);
        //check if the user id exist
         if(!userProfile){
           let err= new Error("user to be unfollowed not found");
            next(err);
            return;
        }
        // avoid current user to follow self
        if(userIdTounfollow.toString()===currentUserId.toString()){
           let err = new Error("cannot unfollow yourself");
            next(err);
            return;
        }
        // check if we have already followed the user
        const currentUser=user.findById(currentUserId);
        if(!currentUser.following.includes(userIdTounfollow)){//includes
           let err= new Error("you can not unfollow the user ,you did not follow");
            next(err);
            return;
        }
        // remove the userIdTounfollow from following array of current user
        await user.findByIdAndUpdate(
         currentUserId,
         {  $pull:{
                      following:userIdTounfollow
                      }
          },
          { new:true }
         );
       
        resp.json({
                     status:"success",
                     message:"user unfollowed successfully",
                     userProfile:userProfile
                   });
      })  
//@desc forgot password
//@route put/api/v1/users/forgot-password
//@access public
exports.forgotPassword= asyncHandler(async(req,resp,next)=>{
 // fetch the email
 const {email}=req.body;
 // check if the email exist
 const userFound=await user.findOne({email});
 if(!userFound){
    let err= new Error("user with this email not registered");
     next(err);
     return;
 }
 //get the reset token
 const resetToken=await userFound.generatePasswordResetToken();
 //!save the changes to the data base(resetToken and resetTokenExpires)
 await userFound.save();
sendEmail(email,resetToken);
}) 
//@desc reset password
//@route post/api/v1/users/reset-password/:reset-token
//@access public
exports.resetPassword= asyncHandler(async(req,resp,next)=>{
    //get the token from params 
    const {resetToken}=req.params;
    //getting the password
    const {password}=req.body;
 //convert resetToken to hash token
 const hashedToken=crypto.createHash("sha256").update(resetToken).digest("hex"); 

 // verify the token with db token
 const userFound=await user.findOne({
    passwordResetToken:hashedToken,
    passwordResetExpires:{$gt:Date.now()}
 })
 if(!userFound){
    let err= new Error("token expired");
     next(err);
     return;
 }
 // update the new password
const salt=await bcrypt.genSalt(10);
const hashedPassword=await bcrypt.hash(password,salt);
userFound.password=hashedPassword;
userFound.passwordResetToken=undefined;
userFound.passwordResetExpires=undefined;

//!resave the user
 await userFound.save();


 // send the json response
    resp.json({
        status:"success",
        message:"password reset successfully"
    })
})

//@desc send Account verification mail
//@route post/api/v1/users/account-verification-email
//@access private
exports.sendAccountVerificationEmail=asyncHandler(async(req,resp,next)=>{
   //find the current user email
  const currentUser=user.findById(req?.userAuth?.id);
  if(!currentUser){
     let err= new Error("user not found");
      next(err);
      return;
  }
  //get the token from current user object
  const verifyToken=await currentUser.generateAccountVerificationToken();
  await currentUser.save();
  //send the mail
  sendAccountVerificationEmail(currentUser.email,verifyToken);
  resp.json({
    status:"success",
    message:"account verification email sent successfully"
  })
})
//@descaccount token verification
//@route put/api/v1/users/verify-Account/:token
//@access private
exports.verifyAccount=asyncHandler(async(req,resp,next)=>{
   //get the token from params
   const {verifyToken}=req.params;
   //convert the token to hash
   const hashedToken=crypto.createHash("sha256").update(verifyToken).digest("hex");
   //find the user with the token
   const userFound=await user.findOne({
      accountVerificationToken:hashedToken,
      accountVerificationExpires:{$gt:Date.now()}
   })
   if(!userFound){
      let err= new Error("token expired");
       next(err);
       return;
   }
   //update the user accountVerified
   userFound.accountVerified=true;
   userFound.accountVerificationToken=undefined;
   userFound.accountVerificationExpires=undefined;
   //resave the user
   await userFound.save();
   //send the json response
   resp.json({
    status:"success",
    message:"account verified successfully done"
  })
})