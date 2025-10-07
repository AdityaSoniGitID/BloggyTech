const mongoose=require("mongoose");
const connectDB=async()=>{

try{
    
     await mongoose.connect(process.env.MONGO_url);//used process.env to access the data og env.
     console.log("connected successfully to mongoDB");

}catch(error){
     console.log("connection to mongoDB failed :",error.message);
}
};
module.exports=connectDB;