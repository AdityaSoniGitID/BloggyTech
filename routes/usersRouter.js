const express=require("express");
const {register, login, getProfile, blockUser,viewAthorProfile, followingUser, unfollowingUser, forgotPassword, resetPassword, sendAccountVerificationEmail, verifyAccount,}=require("../../controllers/users/usersController");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const usersRouter=express.Router();
//!register route
usersRouter.post("/register",register);

//!login route
usersRouter.post("/login",login);

//!profile route
usersRouter.post("/profile",isLoggedIn,getProfile);//isLogged in middleware

//!profile block route
usersRouter.put("/block/:userIdToBlock",isLoggedIn,blockUser);

//!profile view route
usersRouter.get("/view/:userProfileId",isLoggedIn,viewAthorProfile);

//!follow a user route
usersRouter.get("/following/:userIdToFollow",isLoggedIn,followingUser);

//!unfollow a user route
usersRouter.get("/unfollowing/:userIdTounFollow",isLoggedIn,unfollowingUser);//unfollowingUser

//!forgot password route
usersRouter.post("/forgot-password",forgotPassword);

//!reset password route
usersRouter.post("/reset-password",resetPassword);

//!send Account verification mail route
usersRouter.get("/account-verification-email",isLoggedIn,sendAccountVerificationEmail);

//! Account token verification route
usersRouter.get("/verify-account/:verifyToken",isLoggedIn,verifyAccount);

module.exports=usersRouter;