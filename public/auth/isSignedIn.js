// This function will check if user's cookie session is valid and matches the one in their mongodb.
// If it's invalid it timed out.
// If it doesnt match, then the cookies where tampered with.

module.exports = (res, req) => {
    if (cookies.accepted == true) {
        // if they accept cookies
        cookies.save();
    } else {
        // if they dont accept
        cookies.save();
    }
};
