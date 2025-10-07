const user=require("../models/Users/user");
const isAccountVerify=asyncHandler(async(req,resp,next)=>{
  
        const currentUser=await user.findById(req?.userAuth?.id);
        //ckeck if user is verify
        if(!currentUser.isAccountVerified){
           let err= new Error("account not verified");
            next(err);
            return;
        }

        if(!currentUser){
           let err= new Error("user not found");
            next(err);
            return;
        }

        next();
})

module.exports=isAccountVerify;