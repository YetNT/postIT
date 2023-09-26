const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        encrypted: {
            type: String,
            required: true,
        },
        salt: {
            type: String,
            required: true,
        },
    },
    email: {
        type: String,
        default: "",
    },
    sessionToken: {
        type: Date,
        required: true,
    },
    profile: {
        joined: {
            type: Date,
            default: Date.now,
        },
        lastEdit: {
            type: Date,
            default: Date.now,
        },
        bio: {
            type: String,
            default: "",
        },
    },
});

module.exports = mongoose.model("user", userSchema);
