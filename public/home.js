const { validateSessionFriendly } = require("./_auth/isSignedIn");

async function render(req, res) {
    const signedIn = await validateSessionFriendly(req);
    res.render("home", {
        signedIn: signedIn.output,
        userId: signedIn.userId,
    });
}

const get = async (req, res) => {
    try {
        await render(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = { get };
