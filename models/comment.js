const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    postId: {
        type: String,
        required: true,
    },
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

commentSchema.virtual("commentId").get(function() {
    return this._id.toHexString();
});

commentSchema.set("toJSON", {
    virtuals: true,
});

module.exports = mongoose.model("Comments", commentSchema);