const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapasync.js");
const passport = require("passport");
const { isSaveUrl } = require("../middleware.js");

const controllerUser = require("../controller/user.js");

router.route("/signup").get(controllerUser.renderSignUpForm).post(wrapAsync(controllerUser.signUp));

router.route("/login").get(controllerUser.renderLoginForm).post(isSaveUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), controllerUser.login);

router.get("/logout", controllerUser.logOut);

module.exports = router;