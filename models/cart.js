const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema(
  {
    items: [{ type: Schema.Types.ObjectId, ref: "itemCart" }],
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "authentication",
    },
    totalItems: {
      type: Schema.Types.Number,
      default: 0,
    },
    total: {
      type: Schema.Types.Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("cart", cartSchema);
