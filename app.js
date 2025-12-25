if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
};
// console.log(process.env.SECRET);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
const dbURL = process.env.ATLAS_URL;
// const wrapAsync = require("./utils/wrapasync.js");
const expressLayouts = require("express-ejs-layouts");
const ExpressError = require("./utils/ExpressError.js");
// const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");



const session = require("express-session");
const MongoStore = require('connect-mongo').default;
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./Routes/listings.js");
const reviewRouter = require("./Routes/review.js");
const userRouter = require("./Routes/user.js");
// const cookie = require('express-session/session/cookie.js');

console.log(typeof MongoStore.create);
const store = MongoStore.create({
    mongoUrl: dbURL,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600

});

store.on("error", () => {
    console.log("ERROR IN MONGO SESSION", err);
});

const sessionOption = {

    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expire: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};




async function main() {
    await mongoose.connect(dbURL);
};

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
})


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    res.locals.reviewUser = Review.auther;
    next();
});



app.use("/listings", listingRouter);
app.use("/listings/:id/review", reviewRouter);
app.use("/", userRouter);

// app.get("/", (req, res) => {
//     res.send("Start Working");
// });
app.use((req, res, next) => {
    next(new ExpressError(404, "Page NOt Found...!"));
});


//middleware
app.use((err, req, res, next) => {
    let { status = 500, message = "Something Went Wrong" } = err;
    res.status(status).render("error.ejs", { message });
});




app.listen(8080, () => {
    console.log("server is started");
});
