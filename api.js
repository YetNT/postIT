const User = require("./userSchema.js");
const { comparePassword } = require("./util.js");

const userExists = async (req, res) => {
    try {
        const id = req.body.id;
        const query = { id: id };
        let user = await User.findOne(query);
        let response;
        response = { exists: !user ? false : true };

        res.status(200).send(response);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

const correctPassword = async (req, res) => {
    try {
        const id = req.body.id;
        const password = req.body.password;
        const query = { id: id };
        let user = await User.findOne(query);

        if (!user) return res.status(404).send({ error: "user not found." });

        let status = await comparePassword(password, user.password.encrypted);
        let response;
        response = { correct: !status ? false : true };
        console.log(response);
        console.log(id);
        console.log(password);

        res.status(200).send(response);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = { userExists, correctPassword };
