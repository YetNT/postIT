const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    authorId: {
        type: String,
        required: true,
    },
    authorName: {
        type: String,
        required: true,
    },
    mode: {
        /**
         * Mode 0 = Dev post
         * Mode 1 = Public post (Anybody can view and find)
         * Mode 2 = Private 1 (Anybody with link can view)
         * Mode 3 = Private 2 (Only author can view)
         * Mode 4 = Moderated post
         * Mode 5 = Archived post
         */
        type: Number,
        default: 1,
    },
    comments: [
        {
            author: String,
            content: String,
            username: String,
            edited: {
                type: Boolean,
                default: false,
            },
            time: {
                created: {
                    type: Date,
                    default: Date.now,
                },
                edited: {
                    type: Date,
                    default: new Date(0),
                },
            },
        },
    ],
    created: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("post", postSchema);
