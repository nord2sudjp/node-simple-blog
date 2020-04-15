const path = require("path");

const express = require("express");
const router = new express.Router();

router.get("/about", (req, res) => {
  res.render("about");
  //res.sendFile(path.resolve(__dirname, "../../pages/about.html"));
});

module.exports = router;
