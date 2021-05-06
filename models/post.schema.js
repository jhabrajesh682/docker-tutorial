const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const postSchema = new Schema({
    postTitle: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },

    tags: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});




module.exports = Users = mongoose.model("post", postSchema);
