const User = require("../../userSchema");
const path = require("path");
const { generateSlug } = require("../../util");

function generateToken() {
    // Get the current date in milliseconds
    const currentDate = new Date();
    const currentDateMs = currentDate.getTime();

    // Calculate milliseconds in 40 days
    const daysToAdd = 40;
    const millisecondsInADay = 24 * 60 * 60 * 1000;
    const daysInMilliseconds = daysToAdd * millisecondsInADay;

    // Calculate the future date in milliseconds
    const futureDateMs = currentDateMs + daysInMilliseconds;

    // Create a new Date object with the future date
    const futureDate = new Date(futureDateMs);

    return futureDate.setMilliseconds(0);
}

// Route to handle the form submission and create a new post
const post = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const id = generateSlug(username);
        let query = { id: id };
        const sessiontoken = generateToken();

        let existing = await User.findOne(query);
        if (existing) return res.status(403).send("Alredy exists.");
        let userObject = {
            id: id,
            username: username,
            password: password,
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
    res.sendFile(path.join(__dirname + "/index.html"));
};

module.exports = { post, get };
