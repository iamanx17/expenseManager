const cateModel = require("../models/category");

exports.getCat = async (req, res, next) => {
  const categories = await cateModel.find({ user: req.session.user._id });
  if (!categories) {
    return res.render("category.njk", { category: [], user: req.session.user });
  }
  return res.render("category.njk", {
    category: categories,
    user: req.session.user,
  });
};

exports.postCat = async (req, res, next) => {
  const catEntity = await cateModel.findOne({
    category_name: req.body.category_name,
  });

  if (catEntity) {
    return res.render("category.njk", {
      message: "This category is already added!!",
    });
  }
  const category = new cateModel({
    category_name: req.body.category_name,
    user: req.session.user._id,
  });
  category.save();
  return res.redirect("/category");
};

exports.removeCat = async (req, res, next) => {
  const catId = req.params.catId;
  const catEntity = await cateModel.findByIdAndDelete(catId);
  return res.redirect("/category");
};

exports.editCat = async (req, res, next) => {
  const catId = req.params.catId;
  const catEntity = await cateModel.findByIdAndUpdate(catId, {
    category_name: req.body.edit_cat_name,
  });
  return res.redirect("/category");
};
   