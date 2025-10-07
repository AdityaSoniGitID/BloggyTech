const express=require("express");
const {createCategory,getAllCategories,deleteCategory, updateCategory}=require("../../controllers/categories/categoriesController");
const isLOggedIn=require("../../middlewares/isLoggedIn");

const categoriesRouter=express.Router();
//! create category route
categoriesRouter.post("/",isLOggedIn,createCategory);

//! feachAll category route
categoriesRouter.get("/",getAllCategories);

//! delete category route
categoriesRouter.delete("/:id",isLOggedIn,deleteCategory);

//! update category route
categoriesRouter.put("/:id",isLOggedIn,updateCategory);

module.exports=categoriesRouter;