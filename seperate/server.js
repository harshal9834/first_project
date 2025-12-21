const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// const cookies = require("cookie-parser");
app.use(session({
    secret: "secretecode",
    resave: false,
    saveUninitialized: true
}));
app.use(flash());
// app.use(cookies("secretecookies"));
app.get("/register", (req, res) => {
    let { name = "anynomoous" } = req.query;
    req.session.name = name;
    if (req.session.name === "anynomoous") {
        req.flash("error", "Registered NOt successfully");
    } else {
        req.flash("success", "Registered successfully");
    }

    res.redirect("/page");
});
app.get("/page", (req, res) => {
     res.locals.sucmsg = req.flash("success");
    res.locals.errmsg = req.flash("error");
    // res.send(`Hello, ${req.session.name}`);
    res.render("register.ejs", { nav: req.session.name });
});
app.get("/test", (req, res) => {
    if (req.session.count) {
        req.session.count++;
    } else {
        req.session.count = 1;
    }
    res.send(`Server req is ${req.session.count} times`);
});

// app.get("/cookies2", (req, res) => {
//     res.cookie("made-by", "china");
//     res.send("wellcome to my cookies-2")
//     // console.log("This cooies called");
// });

// app.get("/cookies1", (req, res) => {
//     res.cookie("made-in", "India", { signed: true });
//     res.send("wellcome to my cookies-1")
//     // console.log("This cooies called");
// });

// app.get("/verifie", (req, res) => {
//     console.log("unsigned cookies:", req.cookies);
//     console.log("singned", req.signedCookies);
//     res.send("Checking your cookies...");
//     // console.log("This cooies called");
// });
// app.get("/check", (req, res) => {

//     let count;

//     if (req.cookies.count) {
//            count = parseInt(req.cookies.count);
//         count++;
//     } else {
//         count = 1;
//     }

//     res.cookie("count", count);

//     res.send(`You visited this route ${count} times`);
// });


app.get("/", (req, res) => {
    res.send("This is root");
});

app.listen(3000, (req, res) => {
    console.log("server is listening....!");
});