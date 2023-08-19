function verifySessionToken(cookieSessionToken, databaseSessionToken) {
    return databaseSessionToken.getTime() !==
        new Date(parseInt(cookieSessionToken)).getTime()
        ? false
        : true;
}

function generateSlug(title) {
    // Convert to lowercase and replace non-alphanumeric characters and spaces with a dash
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "") // Replace non-word characters (excluding spaces and dashes)
        .replace(/\s+/g, "-") // Replace spaces with dashes
        .replace(/-+/g, "-"); // Replace consecutive dashes with a single dash
}

const PostMode = Object.freeze({
    dev: 0,
    public: 1,
    linkPrivate: 2,
    authorPrivate: 3,
    moderated: 4,
    archived: 5,
});

module.exports = {
    verifySessionToken,
    PostMode,
    generateSlug,
};
