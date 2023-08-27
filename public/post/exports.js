const Post = require("../../postSchema");
const User = require("../../userSchema");
const { PostMode } = require("../../util");
var url = require("url");

function render(req, res, post, user) {
    let edit = "";
    if (post.authorId == user.id) {
        edit = `<a class="navA" href="/post/${post.id}/edit">Edit Post</a>`;
    }

    res.render("post/page", {
        title: post.title,
        content: post.content.replace(/\n/g, "<br>"),
        edit: edit,
        username: post.authorName,
        postId: post.id,
        userId: user.id,
        comments: post.comments,
        description: post.content,
        link: url.format({
            protocol: req.protocol,
            host: req.get("host"),
            pathname: `${req.originalUrl}`,
        }),
    });
}

const get = async (req, res) => {
    const id = req.params.id;
    const userCookie = req.cookies.user;

    try {
        const post = await Post.findOne({ id: id });
        let JSONparsed =
            userCookie !== undefined
                ? JSON.parse(userCookie)
                : { _doc: { id: "invalid" } };
        let user = await User.findOne({
            id: JSONparsed["_doc"].id,
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

const deleteOrEditComment = async (req, res) => {
    const commentId = req.params.comment;
    const userId = req.params.user;
    const postId = req.params.post;
    const newContent = req.params.newContent;

    try {
        let post = await Post.findOne({ id: postId });
        let user = await User.findOne({ id: userId });

        if (!post || !user) return res.status(404).send("Post/user not found.");

        const comment = post.comments.find(
            (comment) => comment._id.toString() === commentId
        );

        if (!comment) return res.status(404).send("Comment not found.");

        if (comment.author !== userId)
            return res.status(400).send("This aint your comment bro.");

        if (newContent !== undefined) {
            // Editing comment
            comment.content = newContent;
        } else {
            // Deleting comment
            post.comments = post.comments.filter(
                (comment) => comment._id.toString() !== commentId
            );
        }

        await post.save();
        res.redirect(`/post/${postId}`);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = { get, newComment, deleteOrEditComment };
