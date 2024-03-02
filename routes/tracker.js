const express = require("express");

const transController = require("../controllers/transactions");
const tagsController = require("../controllers/tags");
const catController = require("../controllers/category");
const userController = require("../controllers/user");
const auth = require("../utils/user");

const router = express.Router();

//dashboard router
router.get("/", auth.is_authenticated, userController.dashboard);

//search options
router.post("/search", auth.is_authenticated, transController.searchTrans);

//Transactions router
router.post("/transactions", auth.is_authenticated, transController.postTrans);
router.post(
  "/deletetransactions/:transID",
  auth.is_authenticated,
  transController.deleteTrans
);

//Tags router
router.get("/tags", auth.is_authenticated, tagsController.getTag);
router.post("/tags", auth.is_authenticated, tagsController.postTag);
router.get("/tags/:tagId", auth.is_authenticated, tagsController.findTags);
router.post("/edittag/:tagId", auth.is_authenticated, tagsController.editTag);
router.post(
  "/deletetag/:tagId",
  auth.is_authenticated,
  tagsController.removeTag
);

//category router
router.get("/category", auth.is_authenticated, catController.getCat);
router.post("/category", auth.is_authenticated, catController.postCat);
router.post(
  "/editcategory/:catId",
  auth.is_authenticated,
  catController.editCat
);
router.post(
  "/deletecategory/:catId",
  auth.is_authenticated,
  catController.removeCat
);

//budget router
router.post("/budget", auth.is_authenticated, transController.postBudget);

module.exports = router;
