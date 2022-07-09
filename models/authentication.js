const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const authenticationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: false,
      default: "",
    },
    cart: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'cart',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("authentication", authenticationSchema);
