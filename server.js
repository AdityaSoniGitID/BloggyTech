const express= require("express");
const connectDB=require("./config/database")
const dotenv=require("dotenv");
const usersRouter=require("./routes/users/usersRouter");
const postsRouter=require("./routes/posts/postRouter");
const categoriesRouter=require("./routes/categorise/categoriesRouter");
const { globalErrorHandler, notFound } = require("./middlewares/globalErrorHandler");
const commentsRouter = require("./routes/comments/commentsRouter");
const { sendEmail } = require("./utils/sendEmail");

//!create an express app
sendEmail("soniaditya7491@gmail.com","hello welcom");
const app=express();

//!load the enviroment variable
dotenv.config();// it will load all the enviroment variable from .env file

//!Establish connection to MongoDB
connectDB();

//! Middleware to parse JSON requests
app.use(express.json());



//! setup the router
//? setup the users Router
app.use("/api/v1/users",usersRouter);

//? setup the category Router
app.use("/api/v1/categories",categoriesRouter);

//? setup the posts Router
app.use("/api/v1/posts",postsRouter);

//? setup the comments Router
app.use("/api/v1/posts",commentsRouter);

//!not found error handler for route
//? this middleware will always placed between route and globle error handler middleware
app.use(notFound);


//! setup globle error handler
app.use(globalErrorHandler);



const PORT= process.env.PORT||3000;
app.listen(PORT,()=>{
    console.log(`server start at ${PORT}`);
});
