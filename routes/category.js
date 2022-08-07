const express = require("express");
const multer = require("multer");
const fs = require("fs");

const categoryControllers = require("../controllers/category");

const router = express.Router();

const fsCategory = multer.diskStorage({
  destination: (req, file, cb) => {
    const path = `images/category`;
    fs.mkdirSync(path, { recursive: true });
    cb(null, path);
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

router.post(
  "/add-category",
  multer({ storage: fsCategory }).fields([
    { name: "icon", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  categoryControllers.createCategory
);

router.get('/all-category',categoryControllers.getCategory)

module.exports = router;
