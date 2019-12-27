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
    // userId = req._passport.session.user.id;
    // Successful authentication, redirect home.
    res.redirect("/admin");
  }
);

router.post("/uploadFile", (req, res) => {
  name = req.body.upload;
  uploadFile(name);
  res.render("uploadSucess", { title: "O seu arquivo está nas núvens :)" });
});

const ID = "AKIA6GGKPPKN2YIK4RVL";
const SEGREDO = "u0ce0j/dJ74H2XbBSHBZDS7Q/G+FBDOQgnAV9l1H";
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

router.get("/removeFile/:name", (req, res) => {
  console.log("Chegou na rota");
  remove(req.params.name);
  res.redirect("/admin");
});

function remove(fileName) {
  console.log("Chegou na função " + fileName);
  s3.deleteObject(
    {
      Bucket: BUCKET_NAME,
      Key: fileName
    },
    function(err, data) {
      if (err) {
        throw err;
      } else {
        console.log("File deleted");
      }
    }
  );
}

//List data
async function getAwsData() {
  try {
    AWS.config.setPromisesDependency();
    AWS.config.update({
      accessKeyId: ID,
      secretAccessKey: SEGREDO,
      region: "us-east-2"
    });
    const s3 = new AWS.S3();
    var response = await s3
      .listObjectsV2({
        Bucket: BUCKET_NAME
      })
      .promise();
    //console.log(response);
    return response.Contents;
  } catch (e) {
    console.log("our error", e);
  }
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    // req.user is available for use here
    return next();
  }
  // denied. redirect to login
  res.redirect("/");
}

router.get("/admin", ensureAuthenticated, function(req, res) {
  getAwsData().then(data =>
    res.render("admin", {
      user: req.session.passport.user.displayName,
      title: "DropaTudo",
      files: data,
      location: data.location
    })
  );
});

module.exports = router;
