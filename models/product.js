const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  productName: {
    type: String,
    required: true,
  },
  qtyStock: {
    type: Schema.Types.ObjectId,
    ref: "stock",
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "category",
  },
  productDetail: {
    type: String,
    required: true,
  },
  productSize: {
    type: Number,
    required: true,
  },
  productPrice: {
    type: Schema.Types.Number,
    required: true,
  },
  productImage: {
    type: Schema.Types.Array,
    required: true,
  },
});

module.exports = mongoose.model("product", productSchema);
