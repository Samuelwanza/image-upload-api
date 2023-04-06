const express = require("express");
const dotenv = require("dotenv");
const multer = require("multer");
const router = express.Router();
dotenv.config();
const upload = multer({
  dest: "src/images",
});

const uploadController = require("../controllers/uploadController");

router.get("/", (_, res) => res.send("Welcome to S3 File Uploader"));
router.post("/upload", upload.single("File"), uploadController.uploadMyFile);
router.get("/files/", uploadController.getFiles);

module.exports = router;
