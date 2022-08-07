const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stockSchema = new Schema({
  stock: Schema.Types.Number,
});

module.exports = mongoose.model("stock", stockSchema);
