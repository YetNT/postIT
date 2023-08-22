const path = require("path");

module.exports = (req, res) => {
    try {
    res.clearCookie("user", {path:'/'});
    res.clearCookie("sessionToken", {path:'/'});

    res.sendFile(path.join(__dirname + "/page.html"));
    } catch (error) {
    res.status(500).send("Internal server err")
}
};
