const { validateSessionFriendly } = require("./_auth/isSignedIn");
const Post = require("../postSchema");
const { PostMode } = require("../util");

async function render(req, res, devPosts, newPosts, archivedPosts) {
    const signedIn = await validateSessionFriendly(req);
    res.render("home", {
        signedIn: signedIn.output,
        userId: signedIn.userId,
        devPosts,
        newPosts,
        archivedPosts,
    });
}

const getNewestPosts = async () => {
    try {
        const newestPosts = await Post.find({}).sort({ created: -1 }).limit(5);

        return newestPosts;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getDevPosts = async () => {
    try {
        const devPosts = await Post.find({ mode: PostMode.dev })
            .sort({ created: -1 })
            .limit(5);

        return devPosts;
    } catch (error) {
        console.error(error);
    }
};

const getArchivedPosts = async () => {
    try {
        const archived = await Post.find({ mode: PostMode.archived })
            .sort({ created: -1 })
            .limit(5);

        return archived;
    } catch (error) {
        console.error(error);
    }
};

const get = async (req, res) => {
    try {
        let devPosts = await getDevPosts();
        let newPosts = await getNewestPosts();
        let archived = await getArchivedPosts();

        await render(req, res, devPosts, newPosts, archived);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = { get };
