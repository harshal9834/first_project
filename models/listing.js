const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const listeningSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    description: String,
    image: {
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    category: {
        type: String,
        enum: ["Trending", "Rooms", "Iconic cities", "Mountain", "Castle", "AmazingPool", "Camping", "Farm", "Arctic", "TreeHouse", "BeachFront"]
    }

});
listeningSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});
const listing = mongoose.model("listing", listeningSchema);
module.exports = listing;