const path = require("path");
const Post = require("../../postSchema");
const { PostMode } = require("../../util");

const get = (req, res) => {
    return res.status(200).sendFile(path.join(__dirname + "/page.html"));
};

// Route to handle the form submission and create a new post
const post = async (req, res) => {
    try {
        const title = req.body.title;
        const content = req.body.content;
        const option = req.body.option; // post type options.
        const user = JSON.parse(req.cookies.user)["_doc"];

        let post = new Post({
            title: title,
            content: content,
            authorId: user.id,
            mode: PostMode[option],
            authorName: user.username,
        });

        await post.save();

        res.redirect(path.join(`/post/${post._id.toString()}`));
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = { get, post };
