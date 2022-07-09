const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema(
  {
    address: {
      type: Schema.Types.ObjectId,
      required: false,
    },
    items: [{ type: Schema.Types.ObjectId, required: false, ref: "product" }],
    qty: {
      type: Schema.Types.Array,
      required: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "auth",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("cart", cartSchema);
