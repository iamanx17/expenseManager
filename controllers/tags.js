const tagsModel = require("../models/tags");
const transModel = require("../models/transactions");

exports.findTags = async (req, res, next) => {
  const tagsEntity = await tagsModel.findOne({ _id: req.params.tagId });
  const transEntity = await transModel
    .find({ transactions_tags: req.params.tagId })
    .populate("transactions_tags")
    .populate("transactions_category")
    .populate("user");

  return res.render("search.njk", {
    heading: "All the transactions related to",
    tag_name: tagsEntity.tag_name,
    transactions: transEntity,
  });
};

exports.getTag = async (req, res, next) => {
  const tags = await tagsModel.find({ user: req.session.user });
  if (!tags) {
    return res.render("tag.njk", { tags: [], user: req.session.user });
  }
  return res.render("tag.njk", { tags: tags, user: req.session.user });
};

exports.postTag = async (req, res, next) => {
  const tagsEntity = await tagsModel.findOne({ tag_name: req.body.tag_name });
  if (tagsEntity) {
    return res.redirect("/tags");
  }
  const tag = new tagsModel({
    tag_name: req.body.tag_name,
    user: req.session.user._id,
  });
  tag.save();
  return res.redirect("/tags");
};

exports.removeTag = async (req, res, next) => {
  const tagId = req.params.tagId;
  const tagEntity = await tagsModel.findByIdAndDelete(tagId);
  return res.redirect("/tags");
};

exports.editTag = async (req, res, next) => {
  const tagId = req.params.tagId;
  const tagEntity = await tagsModel.findByIdAndUpdate(tagId, {
    tag_name: req.body.edit_tag_name,
  });
  return res.redirect("/tags");
};
