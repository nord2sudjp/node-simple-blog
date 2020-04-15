const path = require("path");

const express = require("express");
const router = new express.Router();

router.get("/contact", (req, res) => {
  res.render("contact", {});
  //res.sendFile(path.resolve(__dirname, "../../pages/contact.html"));
});

module.exports = router;
