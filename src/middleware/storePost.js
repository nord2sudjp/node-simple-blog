module.exports = (req, res, next) => {
  if (
    !req.body.username ||
    !req.body.title ||
    !req.body.description ||
    !req.body.content
  ) {
    return res.status(400).redirect("/posts/new");
  }
  next();
};
