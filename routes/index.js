var express = require("express");
var router = express.Router();
var passport = require("passport");
/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "DropaTudo" });
});

router.get("/auth/github", passport.authenticate("github"));
router.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function(req, res) {
    userId = req._passport.session.user.id;
    // Successful authentication, redirect home.
    res.redirect("/admin");
  }
);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    // req.user is available for use here
    return next();
  }
  // denied. redirect to login
  res.redirect("/");
}

router.get("/admin", ensureAuthenticated, function(req, res) {
  res.render("admin", { user: req.session.passport.user, title: "DropaTudo" });
});

module.exports = router;
