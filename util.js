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
    contributor: 1,
    mod: 2,
    bot: 3,
    company: 4,
    sponsor: 5,
    friend: 6,
    normal: 7,
    mute: 8,
    banned: 9,
});

const UserStatusInfo = Object.freeze({
    0: "creator, developer and maintainer of postIT website and server",
    1: "Owner of a successfully merged pull request",
    2: "Moderator, who can ban and mute users, and place posts for moderation/archive",
    3: "Robot, Not a real human but a machine with set tasks and goals",
    4: "Some goofy corperation",
    5: "somebody who has helped development of this buy donating. Thank you :)",
    6: "real life friend of dev",
    7: "A normal person on this site",
    8: "Muted. This person cannot make/edit comments or post posts",
    9: "Banned User. They have no access to the site whatsoever",
});

module.exports = {
    verifySessionToken,
    PostMode,
    UserStatus,
    UserStatusInfo,
    generateSlug,
    generateToken,
    encryptPassword,
    comparePassword,
};
