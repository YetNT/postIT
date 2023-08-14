const path = require("path");
let signup = {};

signup.get = (req, res) => {
    res.sendFile(path.join(__dirname + "/signup" + "/index.html"));
};

module.exports = { signup };
