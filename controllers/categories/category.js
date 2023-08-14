const asyncHandler = require("express-async-handler");
const Category = require("../../model/Category/Category");

// create single category
exports.createCategory = asyncHandler(async (req, res) => {
  const { name, author } = req.body;

  const categoryFound = await Category.findOne({ name });
  if (categoryFound) {
    res.status(400);
    throw new Error("Category already exists");
  }
  const category = await Category.create({
    name: name,
    author: req.userAuth?._id,
  });
  res.status(201).json({
    status: "Hooray",
    message: "Category created",
    category,
  });
});

// get all categories
exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).populate({
    path: "posts",
    model: "Post",
  });

  res.status(201).json({
    status: "Hooray",
    message: "You got all the categories",
    categories,
  });
});

// delete single category
exports.deleteCategory = asyncHandler(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);

  res.status(201).json({
    status: "Hooray",
    message: "You deleted the heck out of that category",
  });
});

// update single category
exports.updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(201).json({
    status: "Hooray",
    message: "You updated the categories",
    category,
  });
});
