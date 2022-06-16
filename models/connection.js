const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 200 },
  IPv4: String,
  country_name: String,
  latitude: Number,
  longitude: Number,
  avatar: Number,
  date: { type: Date, default: new Date() },
});

const Connection = mongoose.model("Connection", connectionSchema);

exports.Connection = Connection;
