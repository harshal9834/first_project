const express = require("express");
const router = express.Router({ mergeParams: true });
const { validatereview, isLoggedIn } = require("../middleware.js");

const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const listing = require("../models/listing.js");
const listings = require("../Routes/listings.js");
const { isReviewAuther } = require("../middleware.js");
const controllerReview = require("../controller/review.js");
const review = require("../models/review.js");


router.post("/", isLoggedIn, validatereview, wrapAsync(controllerReview.createReview));

//deleterevieeroute
router.delete("/:reviewId",isLoggedIn, isReviewAuther, wrapAsync(controllerReview.destroyReview));
module.exports = router;