const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");

const userSchema = new Schema({

    Name: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 5
    },

    password: {
        type: String,
        required: true,
        trim: true,
    }
},
    {
        timestamps: true
    });

// sign JWT and return
userSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id, Name: this.Email }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRY_TIME
    })
}

module.exports = users = mongoose.model("user", userSchema);