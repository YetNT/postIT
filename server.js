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
const cookieParser = require("cookie-parser");
const app = express();

const signout = require("./public/signout/exports.js");
const { validateSession } = require("./public/_auth/isSignedIn");

const create = require("./public/create/exports");
const posts = require("./public/post/exports");
const signup = require("./public/signup/exports");
const signin = require("./public/signin/exports");
const tos = require("./public/tos/exports");
const api = require("./api");
const home = require("./public/home");
const user = require("./public/user/exports");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public"));

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

app.get("/", home.get);

app.get("/user/:id", user.get);
app.get("/create", validateSession, create.get);
app.post("/create", create.post);

app.get("/post/:id", posts.get);
app.patch("/post/:id/edit", posts.editPost);
app.post("/comment/:post/:user", posts.newComment);
app.delete("/comment/:post/:user/:comment", posts.deleteOrEditComment);
app.patch(
    "/comment/:post/:user/:comment/:newContent",
    posts.deleteOrEditComment
);
app.get("/tos", tos);
app.get("/signup", signup.get);
app.post("/signup", signup.post);
app.get("/signin", signin.get);
app.post("/signin", signin.post);
app.get("/signout", signout);

app.post("/api/userExists", api.userExists);
app.post("/api/correctPassword", api.correctPassword);

app.use((req, res) => {
    res.status(404).sendFile(
        path.join(__dirname, "/public", "/_404", "/404.html")
    );
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
