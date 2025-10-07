const  globalErrorHandler =(error,req,resp,next)=>
    {
        const status=error?.status ? error.status :"failed";// ternary operator
        const message=error?.message;
        const stack =error?.stack;//where the error is occuring(file,line)
         resp.status(500).json({status,message,stack});
    };

const notFound=((req,resp,next)=>
    {
    // Error Object
    let error  = new Error(`cannot find the route for ${req.originalUrl} at the server`);
    next(error);
}
)    
module.exports={notFound,globalErrorHandler};