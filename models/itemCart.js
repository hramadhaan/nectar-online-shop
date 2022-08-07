const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemCartSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "product",
    },
    qty: {
      type: Schema.Types.Number,
    },
    // address: {
    //     type: Schema.Types.ObjectId,
    //     ref: ''
    // }
  },
  { timestamps: true }
);

module.exports = mongoose.model("itemCart", itemCartSchema);
