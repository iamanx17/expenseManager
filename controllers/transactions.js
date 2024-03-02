const transModel = require("../models/transactions");
const budgetModel = require("../models/budget");
const mongoose = require("mongoose");

const TRANSACTION_TYPE = ["credit", "debit"];

exports.deleteTrans = async (req, res, next) => {
  const transID = req.params.transID;
  const transEntity = await transModel.findByIdAndDelete(transID);
  return res.redirect("/");
};

exports.searchTrans = async (req, res, next) => {
  const tag_name = req.body.tag_name;
  const transEntity = await transModel
    .find({ user: req.session.user._id })
    .populate("transactions_tags", "tag_name")
    .populate("transactions_category", "category_name");

  let transactions = [];
  for (let trans of transEntity) {
    for (let tag_list of trans.transactions_tags) {
      console.log(tag_list);
      if (tag_list.tag_name == tag_name) {
        transactions.push(trans);
        break;
      }
    }
  }
  return res.render("search.njk", {
    tag_name: tag_name,
    heading: "Search results for",
    transactions: transactions,
    user: req.session.user,
  });
};

exports.postTrans = async (req, res, next) => {
  const amount = req.body.amount;
  const trans_type = req.body.transactions_type;
  const trans_category = req.body.category_name;
  const transaction_note = req.body.transaction_note;
  const tags = req.body.tags.split(", ");

  if (!TRANSACTION_TYPE.includes(trans_type)) {
    console.log("Invalid transaction type");
    return res.redirect("/");
  }

  let tagsEntity = [];
  for (let i of tags) {
    if (i == "Select your transactions tags") {
      continue;
    }
    let newTagObject = mongoose.Types.ObjectId.createFromHexString(i);
    tagsEntity.push(newTagObject);
  }
  const transaction = new transModel({
    transaction_amount: amount,
    transaction_type: trans_type,
    transactions_tags: tagsEntity,
    transactions_category:
      mongoose.Types.ObjectId.createFromHexString(trans_category),
    transactions_note: transaction_note,
    user: req.session.user._id,
  });
  transaction.save();
  return res.redirect("/");
};

exports.editTrans = (req, res, next) => {};

exports.removeTrans = (req, res, next) => {};

exports.postBudget = async (req, res, next) => {
  const budget_name = req.body.budget_name;
  const category_id = req.body.category_name;
  const budget_amount = req.body.budget_amount;

  const budgetEntity = await budgetModel.findOne({
    user: req.session.user._id,
    budget_name: budget_name,
  });

  if (budgetEntity) {
    console.log("Budget already exists");
    return res.redirect("/");
  }

  const budget = new budgetModel({
    budget_category: mongoose.Types.ObjectId.createFromHexString(category_id),
    budget_name: budget_name,
    budget_total: budget_amount,
    user: req.session.user._id,
  });
  budget.save();
  return res.redirect("/");
};
