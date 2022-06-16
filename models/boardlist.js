const mongoose = require("mongoose");

const boardlistSchema = new mongoose.Schema({
  url: { type: String, required: true },
  type_: { type: String, unique: true, },
  name: { type: String, unique: true, },
});

const Boardlist = mongoose.model("Boardlist", boardlistSchema);

exports.Boardlist = Boardlist;
