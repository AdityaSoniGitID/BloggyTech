const mongoose=require("mongoose");
const userSchema = new mongoose.Schema({
 username:{
    type: String,
    required: true,
 },
 email:{
    type: String,
    required: true,
 },
 role:{
    type:String,
    required: true,
    enum:["user","admin"],
    default:"user",
 },
  password:{
    type: String,
    required: true,
 },
  lastLogin:{
    type: Date,
    default:Date.now(),
 },
  isVerified:{
    type: Boolean,
    default:false,
 },
 accountLevel:{
    type: String,
     enum:["bronze","silver","gold"],
    default:"bronze"
 },
 profilePicture:{
    type: String,
    default:"",
 },
 coverImage:{
    type: String,
    default:""
 },
  bio:{
    type:String,
  },
  location:{
    type:String,
},
notificationType:{
     email:{
    type: String,
    required: true,
 }
},
gender:{
    type:String,
    enum:["male","female","prefer not to say"]
},
// other properties will deal with relationship
profileViewer:[{
               type:mongoose.Schema.Types.ObjectId,
               ref:"user" 
                }],
followers:[{ 
           type:mongoose.Schema.Types.ObjectId,
           ref:"user"
           }],
following:[{ 
           type:mongoose.Schema.Types.ObjectId,
           ref:"user"
           }] ,
blockedUser:[{ 
           type:mongoose.Schema.Types.ObjectId,
           ref:"user"
           }] ,
posts:[{ 
           type:mongoose.Schema.Types.ObjectId,
           ref:"post"
           }],
likedposts:[{ 
           type:mongoose.Schema.Types.ObjectId,
           ref:"post"
           }],
passwordResetToken:[{ 
           type:String
           }],
passwordResetExpires:[{ 
           type:Date
           }],
accountVerificationToken:[{
                 type:String,
                  }],  
accountVerificationExpires:[{
                 type:Date,
                  }],

},{
       
   timestamps:true,// this will add two extra field in mongoDB(created at,update at)

 });

 userSchema.modules.generatePasswordResetToken=async function(){
    const resetToken=crypto.randomBytes(32).toString("hex");
    this.passwordResetToken= crypto.createHash("sha256").update(resetToken).digest("hex");
    //set the expires time to 10 min
    this.passwordResetExpires.push(Date.now()+10*60*1000);//10min
    return resetToken;
 }
  userSchema.modules.generateAccountVerificationToken=async function(){
    const verificationToken=crypto.randomBytes(32).toString("hex");
   this.accountVerificationToken= crypto.createHash("sha256").update(verificationToken).digest("hex");
    //set the expires time to 10 min
    this.accountVerificationExpires.push(Date.now()+10*60*1000);//10min verificationToken;
 }

 //converting schema to model

 const user=mongoose.model("user",userSchema);
  module.exports=user;
