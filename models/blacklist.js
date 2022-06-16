const mongoose = require("mongoose");

const blacklistSchema = new mongoose.Schema({
  list_items: { type: Array, required: true },
  category: String
});

const Blacklist = mongoose.model("Blacklist", blacklistSchema);

exports.Blacklist = Blacklist;
