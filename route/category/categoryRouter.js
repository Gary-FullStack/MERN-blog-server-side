const express = require("express");
const {
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory,
} = require("../../controllers/categories/category");
const isLoggedin = require("../../middlewares/isLoggedin");

const categoryRouter = express.Router();

// create single category
categoryRouter.post("/", isLoggedin, createCategory);

// get all categories
categoryRouter.get("/", getCategories);

// delete single category
categoryRouter.delete("/:id", isLoggedin, deleteCategory);

// update single category
categoryRouter.put("/:id", isLoggedin, updateCategory);

module.exports = categoryRouter;
