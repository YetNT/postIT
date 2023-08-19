const User = require("./userSchema");

function verifySessionToken(cookieSessionToken, databaseSessionToken) {
    return databaseSessionToken.getTime() !==
        new Date(parseInt(cookieSessionToken)).getTime()
        ? false
        : true;
}

async function validateSession(req, res, next) {
    const sessionToken = req.cookies.sessionToken;
    const userCookie = req.cookies.user;
    const parsedUserCookie =
        userCookie !== undefined ? JSON.parse(userCookie) : undefined;

    if (!parsedUserCookie) {
        // no cookie is saved.
        return res.redirect("/signin");
    }

    let query = { id: parsedUserCookie["_doc"].id };
    const user = await User.findOne(query);

    if (!user) {
        // user doesnt ecxist in db
        return res
            .status(404)
            .send(
                "Account not found? Are you logged into a deleted account? If so how the hell"
            );
    }

    if (user.password !== parsedUserCookie["_doc"].password) {
        // password has been changed, so clear cookies and redirect to /signin.
        // Either the password has been changed or the cookie has been tampered with.
        const cookies = req.cookies;

        for (const cookieName in cookies) {
            res.clearCookie(cookieName);
        }
        return res.redirect("/signin");
    }

    if (!sessionToken || !verifySessionToken(sessionToken, user.sessionToken)) {
        // sessionToken validation
        return res.redirect("/signin");
    }

    if (new Date(parseInt(sessionToken)) < Date.now()) {
        // check if session is valid
        return res.redirect("/signin");
    }

    next();
}

function generateSlug(title) {
    // Convert to lowercase and replace non-alphanumeric characters and spaces with a dash
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "") // Replace non-word characters (excluding spaces and dashes)
        .replace(/\s+/g, "-") // Replace spaces with dashes
        .replace(/-+/g, "-"); // Replace consecutive dashes with a single dash
}

const PostMode = Object.freeze({
    dev: 0,
    public: 1,
    linkPrivate: 2,
    authorPrivate: 3,
    moderated: 4,
    archived: 5,
});

module.exports = {
    verifySessionToken,
    validateSession,
    PostMode,
    generateSlug,
};
