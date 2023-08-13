const Post = require("../../postSchema");

const get = async (req, res) => {
    const id = req.params.id;

    try {
        const post = await Post.findOne({ id: id });

        if (!post) return res.status(404).send("Post not found");

        res.render("index", {
            title: post.title,
            content: post.content,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = { get };
