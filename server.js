require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const ejs = require("ejs");
const port = 3000;

const app = express();

const create = require("./public/create/exports");
const posts = require("./public/post/exports");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public", "post"));

mongoose
    .connect(process.env.MONGO, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB Atlas!");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB Atlas:", err);
    });

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, `index.html`));
});

app.get("/create", create.getFunc);
app.post("/create", create.postFunc);

app.get("/post/:id", posts.get);

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "public", "404", "404.html"));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
