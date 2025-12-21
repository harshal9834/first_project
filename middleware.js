const listing = require("./models/listing.js");
const review = require("./models/review.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Login First");
        return res.redirect("/login");
    }
    next();
};

module.exports.isSaveUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;

    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listings = await listing.findById(id);
    if (res.locals.currUser && !listings.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the Owner.");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
module.exports.validatelisting = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errmsg);
    } else {
        next();
    }
};
module.exports.validatereview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errmsg);
    } else {
        next();
    }
};

module.exports.isReviewAuther = async (req, res, next) => {
    let { reviewId, id } = req.params;
    let Review = await review.findById(reviewId);
    console.log(Review.auther);
    console.log(res.locals.currUser._id);
    if (!Review.auther.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the Owner.");
        return res.redirect(`/listings/${id}`);
    }
    req.flash("success", "Review delete successfully.");
    next();
};

