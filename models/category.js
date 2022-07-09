const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    category: {
      type: String,
      required: true,
    },
    imageBanner: {
      type: String,
      required: false,
      default: "",
    },
    categoryIcon: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("category", categorySchema);
