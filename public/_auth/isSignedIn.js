const User = require("../../userSchema");
const { verifySessionToken } = require("../../util");

/**
 * validates if signed in when accessing a part of the site that needs it.
 */
const validateSession = async (req, res, next) => {
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

    if (
        user.password.encrypted !== parsedUserCookie["_doc"].password.encrypted
    ) {
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
};

/**
 * Friendlier version to add/remove sign in/up buttons in ejs
 */
const validateSessionFriendly = async (req) => {
    try {
        const userCookies = req.cookies.user;
        return {
            output: !userCookies ? false : true,
            userId: !userCookies
                ? undefined
                : JSON.parse(userCookies)["_doc"].id,
        };
    } catch (error) {
        console.log("error");
    }
};

module.exports = { validateSession, validateSessionFriendly };
