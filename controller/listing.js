const listing = require("../models/listing.js");


module.exports.index = async (req, res) => {
    const { category } = req.query; // query param se category le lo
    let AllListing;

    if (category && category !== "") {
        // agar category select ki hai tab filter apply karo
        AllListing = await listing.find({
            category: { $regex: new RegExp(`^${category}$`, "i") }
        });
    } else {
        // by default sab listings
        AllListing = await listing.find({});
    }

    res.render("listings/index.ejs", { AllListing, category });

};

module.exports.newListing = async (req, res) => {
    res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {

    let { id } = req.params;
    const Listing = await listing.findById(id).populate({
        path: "reviews", populate: {
            path: "auther"
        }
    }).populate("owner");
    // console.log(Listing);
    if (!Listing) {
        req.flash("error", "Listing you requested is not exists..!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing: Listing, mapToken: process.env.MAPBOX_TOKEN });
};

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const Listing = await listing.findById(id);
    if (!Listing) {
        req.flash("error", "Listing you requested is Does not exists..!");
        return res.redirect("/listings");
    }
    let OriginalimageUrl = Listing.image.url;
    OriginalimageUrl = OriginalimageUrl.replace("/upload", "/upload/h_300,w_250");

    console.log(OriginalimageUrl);
    res.render("listings/edit.ejs", { listing: Listing, OriginalimageUrl })
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let newListing = await listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        newListing.image = { url, filename };
        await newListing.save();
    }

    req.flash("success", "Listing is Updated..!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    const Listing = await listing.findByIdAndDelete(id);
    req.flash("success", "Listing is Deleted..!");
    res.redirect("/listings");
};