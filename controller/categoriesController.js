const category=require("../../models/Categories/category");
const asyncHandler=require("express-async-handler");
//@desc create new category
//@route post/api/v1/categories/
//@access private
exports.createCategory= asyncHandler(
   async(req,resp,next)=>{// async beacause it will be long running task
    const {name}=req.body ;
  const isCategoryPresent= await category.findOne({name}) ; 
  if(isCategoryPresent){
    throw new Error("category already present ");
  }
  const category=await category.create({
    name:name,
    author:req?.userAuth?._id
     });
      resp.json({
                        message:"category Created",
                        status:"success",
                        category:category
                        });
});

//@desc get all categories
//@route get/api/v1/categories
//@access public
exports.getAllCategories=asyncHandler(async(req,resp)=>{
      const getAllCategories = await category.find({}).populate(
        { 
          path:"post",
          model:"posts",
          select:"email username role"

        }
      );
      resp.status(201).json(
        {
        status:"success",
        message:"all categories successfully fetched",
        allCategories, 
        })

});

//@desc delete single categories
//@route delete/api/v1/categories/:id
//@access private
exports.deleteCategory=asyncHandler(async(req,resp)=>{
     const catId= req.params.id;
     await category.findByIdAndDelete(catid);
     resp.status(201).json(
        {
        status:"success",
        message:" Categories successfully deleted",
        })

});

//@desc update single categories
//@route put/api/v1/categories/:id
//@access private
exports.updateCategory=asyncHandler(async(req,resp)=>{
     const catId= req.params.id;
     const name=req.body.name;
     await category.findByIdAndUpdate(catId,
                {name:name},
                {new:ture},//return updated document
                {runValidators :ture}//validate the input
              );
     resp.status(201).json(
        {
        status:"success",
        
        message:" Categories successfully updated",
        })

});