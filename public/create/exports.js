const path = require("path");
const Post = require("../../postSchema");
const { generateSlug, PostMode } = require("../../util");

const get = (req, res) => {
    return res.status(200).sendFile(path.join(__dirname + "/index.html"));
};

// Route to handle the form submission and create a new post
const post = async (req, res) => {
    try {
        const title = req.body.title;
        const content = req.body.content;
        const option = req.body.option; // post type options.
        const user = JSON.parse(req.cookies.user)["_doc"];
        const id = generateSlug(title);
        let query = { id: id };

        let existing = await Post.findOne(query);
        if (existing) return res.status(403).send("Alredy exists.");
        let post = new Post({
            title: title,
            content: content,
            id: id,
            authorId: user.id,
            mode: PostMode[option],
        });

        await post.save();

        res.redirect(path.join(`/post/${post.id}`));
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = { get, post };
