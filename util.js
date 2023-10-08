const bcrypt = require("bcrypt");

// Function to generate a salt and hash the password
async function encryptPassword(password) {
    const saltRounds = 10; // Number of salt rounds for bcrypt to use
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return { encrypted: hash, salt: salt };
}

// Function to compare a password with its encrypted counterpart
async function comparePassword(password, encryptedPassword) {
    return await bcrypt.compare(password, encryptedPassword);
}

function verifySessionToken(cookieSessionToken, databaseSessionToken) {
    return databaseSessionToken.getTime() !==
        new Date(parseInt(cookieSessionToken)).getTime()
        ? false
        : true;
}

function generateSlug(title) {
    // Convert to lowercase and replace non-alphanumeric characters and spaces with a dash
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "") // Replace non-word characters (excluding spaces and dashes)
        .replace(/\s+/g, "-") // Replace spaces with dashes
        .replace(/-+/g, "-"); // Replace consecutive dashes with a single dash
}
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

const PostMode = Object.freeze({
    dev: 0,
    public: 1,
    linkPrivate: 2,
    authorPrivate: 3,
    moderated: 4,
    archived: 5,
});

const UserStatus = Object.freeze({
    dev: 0,
    mod: 1,
    bot: 2,
    company: 3,
    sponsor: 4,
    friend: 5,
    normal: 6,
    mute: 7,
    banned: 8,
});

module.exports = {
    verifySessionToken,
    PostMode,
    UserStatus,
    generateSlug,
    generateToken,
    encryptPassword,
    comparePassword,
};
