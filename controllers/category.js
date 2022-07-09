const Category = require("../models/category");
const { validationResult } = require("express-validator");

exports.createCategory = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const category = req.body.category;
  const banner = req.files?.["banner"]?.[0]?.path;
  const icon = req.files["icon"][0].path;

  const dataCategory = new Category({
    category,
    imageBanner: banner,
    categoryIcon: icon,
  });

  dataCategory
    .save()
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "Berhasil menambah kategori",
        data: result,
      });
    })
    .catch((err) => {
      console.log("Hanif", err);
      if (!res.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
