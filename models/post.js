const mongoose = require("mongoose");

const postsSchema = mongoose.Schema({
    editor: {
        type: String,
        required: true,
    },
    
    content: {
        type: String,
    },
    editDate : {
        type : Date,
        required : true,
        default: Date.now
    },
});

postsSchema.virtual("postId").get(function() {
    return this._id.toHexString();
});

postsSchema.set("toJSON", {
    virtuals: true,
});

module.exports = mongoose.model("Posts", postsSchema);