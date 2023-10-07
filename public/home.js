function render(req, res) {
    res.render("home", {
        ejs: "ejs works",
    });
}

const get = async (req, res) => {
    try {
        render(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = { get };
