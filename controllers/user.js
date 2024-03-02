const userModel = require("../models/user");
const tagsModel = require("../models/tags");
const catModel = require("../models/category");
const transModel = require("../models/transactions");
const budgetUseCase = require("../utils/budget");
const budModel = require("../models/budget");
const bcrypt = require("bcrypt");



exports.getRegister = (req, res, next) => {
  return res.render("register.njk");
};

exports.postRegister = async (req, res, next) => {
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const email = req.body.email;
  const phone_number = req.body.phone_number;
  const password1 = req.body.password1;
  const password2 = req.body.password2;

  if (password1 != password2) {
    return res.render("register.njk", { message: "Password not matched" });
  }
  if (phone_number.length < 10) {
    return res.render("register.njk", {
      message: "Phone number length must be 10 digit",
    });
  }
  let user = await userModel.findOne({ email: email });
  if (user) {
    return res.render("register.njk", {
      message: "This email already exists!",
    });
  }
  user = new userModel({
    first_name: first_name,
    last_name: last_name,
    email: email,
    phone_number: phone_number,
    password: await bcrypt.hash(password1, 10),
  });
  user.save();
  return res.render("register.njk", {
    message: "user registeration successful!!",
  });
};

exports.getLogin = (req, res, next) => {
  return res.render("login.njk");
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await userModel.findOne({ email: email });
  if (!user) {
    return res.render("login.njk", { message: "User not found!!" });
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.render("login.njk", { message: "password not matched!!" });
  }
  req.session.user = user;
  req.session.isLoggedin = true;
  return res.redirect("/");
};

exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Some error occured");
    }
    return res.redirect("/");
  });
};

exports.dashboard = async (req, res, next) => {
  const tagsEntity = await tagsModel.find({ user: req.session.user._id });
  const catEntity = await catModel.find({ user: req.session.user._id });
  let budgetEntity = await budModel.find({ user: req.session.user._id }).populate("budget_category", "category_name");
  const transEntity = await transModel
    .find({ user: req.session.user._id })
    .populate("transactions_tags", "tag_name")
    .populate("transactions_category", "category_name");

  let total_transactions = 0;
  let credit_amount = 0;
  let debit_amount = 0;
  for (let i of transEntity) {
    total_transactions += i.transaction_amount;
    if (i.transaction_type == "credit") {
      credit_amount += i.transaction_amount;
    } else {
      debit_amount += i.transaction_amount;
    }
  }
  budgetEntity = budgetUseCase.calculate_total_used_amount(
    transEntity,
    budgetEntity
    );
  return res.render("index.njk", {
    user: req.session.user,
    tags: tagsEntity,
    category: catEntity,
    transaction_amount: total_transactions,
    credit_amount: credit_amount,
    debit_amount: debit_amount,
    transactions: transEntity,
    total_transactions: transEntity.length,
    budgets: budgetEntity,
  });
};
