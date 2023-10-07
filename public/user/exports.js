const { validateSessionFriendly, isAuthor } = require("../_auth/isSignedIn");
const Post = require("../../postSchema");
const User = require("../../userSchema");
var url = require("url");

async function render(req, res, userPosts, id, links, userExists = true) {
    const signedIn = await validateSessionFriendly(req);
    res.render("user/page", {
        signedIn: signedIn.output,
        userId: signedIn.userId,
        givenUserId: id,
        who: (await isAuthor(req, signedIn.username))
            ? "Your Posts"
            : `${signedIn.username}'s Posts`,
        userPosts,
        userExists,
        links,
    });
}

const get = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findOne({ id: id });
        var userPosts = await Post.find({ authorId: id });
        var links = [];
        userPosts.forEach((post) => {
            links.push(
                url.format({
                    protocol: req.protocol,
                    host: req.get("host"),
                    pathname: `post/${post.id}`,
                })
            );
        });
        const userExists = !user ? false : true;
        await render(req, res, userPosts, id, links, userExists);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = { get };