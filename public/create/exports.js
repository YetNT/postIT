const path = require("path");
const Post = require("../../postSchema");

function generateSlug(title) {
    // Convert to lowercase and replace non-alphanumeric characters and spaces with a dash
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "") // Replace non-word characters (excluding spaces and dashes)
        .replace(/\s+/g, "-") // Replace spaces with dashes
        .replace(/-+/g, "-"); // Replace consecutive dashes with a single dash
}

const get = (req, res) => {
    return res.status(200).sendFile(path.join(__dirname + "/index.html"));
};

// Route to handle the form submission and create a new post
const post = async (req, res) => {
    try {
        const title = req.body.title;
        const content = req.body.content;
        const user = JSON.parse(req.cookies.user["_id"]);
        const id = generateSlug(title);
        let query = { id: id };

        let existing = await Post.findOne(query);
        if (existing) return res.status(403).send("Alredy exists.");
        let post = new Post({
            title: title,
            content: content,
            id: id,
            authorId: user.id,
        });

        await post.save();

        // Redirect to the newly created post's page (assuming blog has an "_id" field)
        res.redirect(path.join(`/post/${post.id}`));
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = { get, post };
