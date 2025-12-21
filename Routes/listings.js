const express = require("express");
const router = express.Router();
const listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const { isLoggedIn, isOwner, validatelisting } = require("../middleware.js");
const controllerListing = require("../controller/listing.js");
const multer = require('multer')
const { storage } = require("../cloudConfig");
// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const mapToken = process.env.MAPBOX_TOKEN;
// const geocodingClient = mbxGeocoding({ accessToken: mapToken });
const upload = multer({ storage });

router.route("/").get(controllerListing.index)
    .post(isLoggedIn, upload.single('listing[image]'), validatelisting, wrapAsync(async (req, res, next) => {
        // let geocoding = await geocodingClient.forwardGeocode({
        //     query: "New Delhi",
        //     limit: 1
        // })
        //     .send()
        // console.log(geocoding.body.features.geocoding)

        let url = req.file.path;
        let filename = req.file.filename;
        // const { category } = req.body.listing;
        let newlisting = new listing(req.body.listing);
        // newlisting.category = new listing(category);
        console.log(listing.owner);
        newlisting.owner = req.user._id;
        newlisting.image = { url, filename };
        await newlisting.save();
        req.flash("success", "Listing is created..!");
        res.redirect("/listings");

    }));


router.get("/new", isLoggedIn, controllerListing.newListing);

router.route("/:id").get(controllerListing.showListing).put(isLoggedIn, isOwner, upload.single('listing[image]'), validatelisting, controllerListing.updateListing).delete(isLoggedIn, isOwner, controllerListing.destroyListing);


//edit
router.get("/:id/edit", isLoggedIn, isOwner, controllerListing.editListing);

module.exports = router;

