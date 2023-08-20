const Post = require("../../postSchema");
const User = require("../../userSchema");
const { PostMode } = require("../../util");

function render(req, res, post, user) {
    let edit = "";
    if (post.authorId == user.id) {
        edit = `<a class="navA" href="/post/${post.id}/edit">Edit Post</a>`;
    }

    res.render("post/index", {
        title: post.title,
        content: post.content.replace(/\n/g, "<br>"),
        edit: edit,
        username: user.username,
        postId: post.id,
        userId: user.id,
        comments: post.comments,
    });
}

const get = async (req, res) => {
    const id = req.params.id;
    const userCookie = req.cookies.user;

    try {
        const post = await Post.findOne({ id: id });
        let user = await User.findOne({
            id: JSON.parse(userCookie)["_doc"].id,
        });

        if (!post) return res.status(404).send("Post not found");
        if (!user) user = { id: 0, username: "Unknown" };
        if (PostMode.authorPrivate == post.mode && post.authorId !== user.id) {
            return res.status(405).send("Not allowed.");
        }

        render(req, res, post, user);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

const newComment = async (req, res) => {
    const content = req.body.content;
    try {
        const postId = req.params.post;
        const userId = req.params.user;
        let query = { id: postId };

        let post = await Post.findOne(query);
        if (!post) return res.status(404).send("Post not found.");

        let user = await User.findOne({ id: userId });
        if (!user) return res.status(404).send("Invallid user?");

        post.comments.push({
            content: content,
            author: userId,
            username: user.username,
        });
        await post.save();

        res.redirect(`/post/${postId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

const deleteComment = async (req, res) => {
    const commentId = req.params.comment;
    const userId = req.params.user;
    const postId = req.params.post;
    try {
        let post = await Post.findOne({ id: postId });
        let user = await User.findOne({ id: userId });

        if (!post || !user)
            return res.status(400).send("uhm wtf post/user not found?");

        const comment = post.comments.find(
            (comment) => comment._id.toString() === commentId
        );

        if (!comment) return res.status(400).send("Comment not found."); // code here so the below code doesnt fail.

        post.comments = post.comments.filter(
            (comment) => comment._id.toString() !== commentId
        );

        await post.save();

        res.redirect(`/post/${postId}`);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = { get, newComment, deleteComment };
