const User = require("../models/user.js");
module.exports.renderSignUpForm = (req, res) => {
    res.render("Users/signup.ejs");
};

module.exports.signUp = async (req, res) => {
    try {
        let { username, email, password } = req.body;

        const newuser = new User({ email, username });
        const registerUser = await User.register(newuser, password);
        // console.log(registerUser);
        req.login(registerUser, (err) => {
            if (err) {
                next(err);
            }
            req.flash("success", "User was registered successfully!");

            res.redirect("/listings");
        });

    } catch (e) {
        req.flash("error", "User already exist!");
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("Users/login.ejs")
};

module.exports.login = (req, res) => {
    req.flash("success", "WelCome...!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logOut = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "LogOut Successfull.");
        res.redirect("/listings");
    });
};