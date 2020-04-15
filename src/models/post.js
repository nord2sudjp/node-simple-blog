const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: String,
  description: String,
  content: String,
  username: String,
  image: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;

/*
const post = new Post({
  titlle: "This is new post",
  description: "Something you write",
  content: "More longer content",
});
post
  .save()
  .then(() => console.log("Yew"))
  .catch((error) => {
    console.log(error);
  });
*/
