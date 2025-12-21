const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose").default; 
const Schema = mongoose.Schema;
console.log("type : ",typeof passportLocalMongoose)

const UserSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
