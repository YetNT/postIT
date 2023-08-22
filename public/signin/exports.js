const User = require("../../userSchema");
const { generateSlug, generateToken } = require("../../util");
const path = require("path");

const get = (req, res) => {
    res.sendFile(path.join(__dirname + "/page.html"));
};

const post = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const id = generateSlug(username);

        const sessiontoken = generateToken();

        // Find the user by their username
        let user = await User.findOne({ id: id });

        if (!user) {
            return res.status(401).send("User not found.");
        }

        // Check if the provided password matches the user's password
        if (user.password !== password) {
            return res.status(401).send("Invalid password.");
        }

        user.sessionToken = sessiontoken;
        user.save();

        // Successful authentication
        let { sessionToken, ...userData } = user;
        res.cookie("user", JSON.stringify(userData));
        res.cookie("sessionToken", sessiontoken.toString());

        res.redirect(path.join(`/`));
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = { get, post };
