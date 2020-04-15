const express = require("express");
const Post = require("../models/post");
const path = require("path");
const auth = require("../middleware/auth");

const router = new express.Router();

// /posts/new -> Post create form -> /posts/store
router.get("/posts/new", auth, (req, res) => {
  //if (req.session.userId) {
  res.render("create");
  //}
  //res.redirect("/users/login");
});

// /posts/store -> Create post -> /
router.post("/posts/store", auth, (req, res) => {
  if (req.files) {
    const { image } = req.files;
    image.mv(
      path.resolve(__dirname, "../../public/posts", image.name),
      (error) => {
        if (error) {
          console.log(error);
          res.redirect("/");
          return;
        }
        const fields = {
          ...req.body,
          image: `/posts/${image.name}`,
        };
        createPost(res, fields);
      }
    );
  } else {
    const fields = {
      ...req.body,
      image: "",
    };
    createPost(res, fields);
  }
});

createPost = (res, fields) => {
  Post.create(fields, (error, post) => {
    res.redirect("/");
  });
};

// /posts/:id -> Read one post with id -> post.edge
router.get("/posts/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render("post", {
    post,
  });
});

module.exports = router;
