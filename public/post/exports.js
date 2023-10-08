const Post = require("../../postSchema");
const User = require("../../userSchema");
const { PostMode } = require("../../util");
var url = require("url");

function render(page, req, res, post, user) {
    let edit,
        deletePostForm,
        moderationStatus = "";
    if (post.authorId == user.id) {
        edit = `<a href="/post/${post.id}/edit"><button>Edit Post</button></a>`;
        deletePostForm = `<form action="/post/${post.id}" method="POST"><input type="submit" value="Delete Post" /></form>`;
    }

    moderationStatus =
        post.mode === PostMode.moderated
            ? `[Post has been moderated]`
            : post.mode === PostMode.archived
            ? `[Archived Post]`
            : "";

    res.render(`post/${page}`, {
        title: post.title,
        content: post.content.replace(/\n/g, "<br>"),
        edit: edit,
        username: post.authorName,
        postId: post.id,
        userId: user.id,
        comments: post.comments.reverse(),
        description: post.content,
        deletePostForm,
        PostMode,
        mode: post.mode,
        moderationStatus,
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

        render("page", req, res, post, user);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

const getEdit = async (req, res) => {
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
        if (user.id !== post.authorId)
            return res.status(400).send("Not allowed.");

        render("edit", req, res, post, user);
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

const editPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const newContent = req.body.content;

        let post = await Post.findOne({ id: postId });

        if (!post) return res.status(404).send("post not found?");

        post.content = newContent;
        await post.save();

        res.redirect(`/post/${postId}`);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error. \n ");
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
            comment.edited = true;
            comment.time.edited = Date.now();
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

const deletePost = async (req, res) => {
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
        if (user.id !== post.authorId)
            return res.status(400).send("Not allowed.");

        await Post.deleteOne({ id: id });

        res.redirect(`/`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    get,
    newComment,
    deleteOrEditComment,
    editPost,
    getEdit,
    deletePost,
};
