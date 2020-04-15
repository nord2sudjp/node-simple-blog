// セッション管理はトークンを手動で操作するほうが良い

const User = require("../models/user");

auth = async (req, res, next) => {
  console.log(req.session.userId);
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      throw new Error();
    }
    console.log(user);
    req.user = user;
    next();
  } catch (e) {
    //res.status(401).send({ error: "Please authenticate" });
    return res.redirect("/");
  }
};

module.exports = auth;
