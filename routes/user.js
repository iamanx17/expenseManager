const express = require("express");
const userController = require("../controllers/user");
const auth = require("../utils/user");

const router = express.Router();

//register router
router.get("/register", userController.getRegister);
router.post("/register", userController.postRegister);

//login router
router.get("/login", userController.getLogin);
router.post("/login", userController.postLogin);

//logout router
router.post("/logout", auth.is_authenticated, userController.logout);

module.exports = router;
    