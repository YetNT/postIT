const User = require("../../userSchema");
const path = require("path");
const {
    generateSlug,
    generateToken,
    encryptPassword,
    comparePassword,
} = require("../../util");

// Route to handle the form submission and create a new post
const post = async (req, res) => {
    try {
        const username = req.body.username;
        const pass = req.body.password;
        const id = generateSlug(username);
        let query = { id: id };
        const sessiontoken = generateToken();

        const password = await encryptPassword(pass);
        let existing = await User.findOne(query);
        let userObject = {
            id: id,
            username: username,
            password,
            sessionToken: sessiontoken,
        };
        let user = new User(userObject);

        let { sessionToken, ...userData } = user;
        res.cookie("user", JSON.stringify(userData));
        res.cookie("sessionToken", sessiontoken.toString());

        await user.save();

        // Redirect to the newly created post's page (assuming blog has an "_id" field)
        res.redirect(path.join(`/`));
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

const get = (req, res) => {
    res.sendFile(path.join(__dirname + "/page.html"));
};

module.exports = { post, get };
