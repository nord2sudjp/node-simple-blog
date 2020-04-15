// Require
const path = require("path");
const { config, engine } = require("express-edge");
const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const expressSession = require("express-session");
const connectMongo = require("connect-mongo");
const connectFlash = require("connect-flash");
const edge = require("edge.js");
const redirectIfAuthenticated = require("./middleware/redirectIfAuthenticated");

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
});

// Express setting
//     Initial Setup
const app = new express();
const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));

//     Express Edge
app.use(engine);
const viewDirectoryPath = path.join(__dirname, "../views");
app.set("views", viewDirectoryPath);

//     Others
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(fileUpload());

/*
app.use(
  expressSession({
    secret: "secret",
  })
);
*/
const mongoStore = connectMongo(expressSession);

app.use(
  expressSession({
    secret: process.env.SECRET,
    store: (auth = new mongoStore({
      mongooseConnection: mongoose.connection,
    })),
  })
);

app.use(connectFlash());

// Port
const port = process.env.PORT || 3002;

// Middleware
const storePost = require("./middleware/storePost");
app.use("/posts/store", storePost);

// Routers
const indexRouter = require("./routers/index");
const aboutRouter = require("./routers/about");
const contactRouter = require("./routers/contact");
const postsRouter = require("./routers/posts");
const usersRouter = require("./routers/users");

// Routing

app.use(indexRouter);
app.use(aboutRouter);
app.use(contactRouter);
app.use(postsRouter);
app.use(usersRouter);

app.get("/auth/logout", async (req, res) => {
  console.log("logged out-1");

  //auth.detroy(req.session.id, () => {
  req.session.destroy(() => {
    console.log("logged out");
    res.redirect("/");
  });
  //});
});

app.use("*", (req, res, next) => {
  if (req.session && req.session.userId) {
    console.log("Logined!", req.session.userId);
    edge.global("auth", req.session.userId);
  } else {
    console.log("Not Logined!");
    edge.global("auth", undefined);
  }
  next();
});

app.listen(port, () => {
  console.log("App listening on port:", port);
});
