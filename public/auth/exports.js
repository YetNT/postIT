const path = require("path");
let signup = {};
let signin = {};

signin.get = (req, res) => {
    res.sendFile(path.join(__dirname + "/signin" + "/index.html"));
};
signup.get = (req, res) => {
    res.sendFile(path.join(__dirname + "/signup" + "/index.html"));
};
signup.post = require("./signup/exports");
module.exports = { signup, signin };
