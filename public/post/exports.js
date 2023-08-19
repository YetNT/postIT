const Post = require("../../postSchema");
const User = require("../../userSchema");
const { PostMode } = require("../../util");

const get = async (req, res) => {
    const id = req.params.id;
    const userCookie = req.cookies.user;

    try {
        const post = await Post.findOne({ id: id });
        let user = await User.findOne({
            id: JSON.parse(userCookie)["_doc"].id,
        });

        if (!post) return res.status(404).send("Post not found");
        if (!user) user = { id: "some invalid id idk" };
        if (PostMode.authorPrivate == post.mode && post.authorId !== user.id) {
            return res.status(405).send("Not allowed.");
        }

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
