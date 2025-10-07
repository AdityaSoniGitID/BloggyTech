const jwt=require("jsonwebtoken");
const user=require("../models/Users/user")
const isLoggedIn=(req,resp,next)=>{
   // fetch token from request
   const token=req.headers.authorization?.split(" ")[1];
   //verify  token 
   jwt.verify(token,process.env.JWT_KEY, async(err,decoded)=>{
       if(err){ //if successful, then pass the user object to next path
          const error=new Error(err?.message);
        next(error);
              }
       else { //if unsuccessfull then send the error
          const userId=decoded?.user?.id;
          const user=await user.findById(userId).select("username email role _id");
          req.userAuth=user;
            }  

   })
  

    next();
 };
 module.exports=isLoggedIn;