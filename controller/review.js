const Review = require("../models/review.js");
const listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
    let Listing = await listing.findById(req.params.id);
    let newreview = new Review(req.body.review);

    Listing.reviews.push(newreview);
    newreview.auther = req.user._id;
    // console.log(newreview);
    await newreview.save();
    await Listing.save();

    res.redirect(`/listings/${Listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`)
};