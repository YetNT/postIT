const { validateSessionFriendly } = require("./_auth/isSignedIn");
const Post = require("../postSchema");
const { PostMode } = require("../util");
var url = require("url");

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

function addLink(req, arr) {
    return arr.map((element) => {
        element.link = url.format({
            protocol: req.protocol,
            host: req.get("host"),
            pathname: `post/${element._id.toString()}`,
        });
        return element; // Return the modified element
    });
}

const getNewestPosts = async (req) => {
    try {
        const posts = await Post.find({
            mode: {
                $nin: [
                    PostMode.authorPrivate,
                    PostMode.linkPrivate,
                    PostMode.moderated,
                ],
            },
        })
            .sort({ created: -1 })
            .limit(5);

        const newestPosts = addLink(req, posts);

        return newestPosts;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getDevPosts = async (req) => {
    try {
        const posts = await Post.find({ mode: PostMode.dev })
            .sort({ created: -1 })
            .limit(5);

        const devPosts = addLink(req, posts);

        return devPosts;
    } catch (error) {
        console.error(error);
    }
};

const getArchivedPosts = async (req) => {
    try {
        const posts = await Post.find({ mode: PostMode.archived })
            .sort({ created: -1 })
            .limit(5);

        const archived = addLink(req, posts);

        return archived;
    } catch (error) {
        console.error(error);
    }
};

const get = async (req, res) => {
    try {
        let devPosts = await getDevPosts(req);
        let newPosts = await getNewestPosts(req);
        let archived = await getArchivedPosts(req);

        await render(req, res, devPosts, newPosts, archived);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = { get };
