const express = require("express");
const Post = require("../models/post");

const router = new express.Router();

// / -> read all posts -> index -> /posts/:id
router.get("/", async (req, res) => {
  const posts = await Post.find({});
  res.render("index", { posts });
  //res.send("Hello");
});

// /index -> read all posts -> index -> /posts/:id
router.get("/index", async (req, res) => {
  const posts = await Post.find({});
  res.render("index", { posts });
});

module.exports = router;
