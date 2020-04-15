const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const redirectIfAuthenticated = require("../middleware/redirectIfAuthenticated");

const router = new express.Router();

router.get("/users/register", redirectIfAuthenticated, async (req, res) => {
  msg = "";
  res.render("register", { errors: req.flash("registrationErrors") });
});

router.post("/users/register", redirectIfAuthenticated, async (req, res) => {
  //console.log(req.body);
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).redirect("/");
  } catch (error) {
    const registrationErrors = Object.keys(error.errors).map(
      (key) => error.errors[key].message
    );
    req.flash("registrationErrors", registrationErrors);
    return res.status(400).redirect("/users/register");
  }
});

router.get("/users/login", redirectIfAuthenticated, async (req, res) => {
  res.render("login");
});

router.post("/users/login", redirectIfAuthenticated, async (req, res) => {
  const { email, password } = req.body;
  // try to find the user
  User.findOne(
    {
      email,
    },
    (error, user) => {
      if (user) {
        // compare passwords.
        bcrypt.compare(password, user.password, (error, same) => {
          if (same) {
            // store user session.
            req.session.userId = user._id;
            res.redirect("/");
          } else {
            // login failed, either username or password is wrong
            user = { ...user, msg: "Not found" };
            console.log(user);
            res.status(400).render("login");

            //res.status(400).redirect("/users/login");
          }
        });
      } else {
        // login failed, user is not found.
        user = { ...user, msg: "Not found" };
        console.log(user);
        res.status(400).render("login");

        //return res.status(400).redirect("/users/login");
      }
    }
  );
});

router.get("/users/logout", redirectIfAuthenticated, async (req, res) => {
  req.session.destroy(() => {
    console.log("logged out");
    res.redirect("/");
  });
});

module.exports = router;
