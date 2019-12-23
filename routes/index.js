var express = require("express");
var router = express.Router();
var passport = require("passport");
const fs = require("fs");
const AWS = require("aws-sdk");
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

router.post("/uploadFile", (req, res) => {
  name = req.body.upload;
  uploadFile(name);
  res.render("uploadSucess", { title: "O seu arquivo está nas núvens :)" });
});

const ID = "AKIAISFQ4QU2BE5LTMKQ";
const SEGREDO = "8eMiXDb9N5f3ReKsIm3ZGY/3U8ON4MIdHaUmXTVC";
const BUCKET_NAME = "dropa-tudo";

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SEGREDO
});

const uploadFile = fileName => {
  // Read content from the file
  const fileContent = fs.readFileSync(fileName);
  // Setting up S3 upload parameters
  const params = {
    Bucket: BUCKET_NAME,
    Key: name,
    Body: fileContent
  };

  // Uploading files to the bucket
  s3.upload(params, function(err, data) {
    if (err) {
      throw err;
    }
    console.log(`File uploaded successfully. ${data.Location}`);
  });
};

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
