const winston = require("winston");
const auth = require("../middleware/auth");
const { Connection } = require("../models/connection");
const Joi = require("joi");
const express = require("express");
const router = express.Router();

// router.get("/", auth, async (req, res, next) => {
router.get("/", async (req, res, next) => {
  try {
    const list = await Connection.find();
    res.send(list);
  } catch (error) {
    res.status(500).send("Error: " + error.message);
    winston.error(error.message);
  }
});

router.post("/", async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    IPv4: Joi.string(),
    country_name: Joi.string(),
    country_code: Joi.string(),
    city: null,
    postal: null,
    state: null,
    latitude: Joi.number(),
    longitude: Joi.number(),
    avatar: Joi.number(),
    date: Joi.date(),
  });
  const { error } = schema.validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const { IPv4, name, country_name, latitude, longitude, avatar } = req.body;

  let word_instance = new Connection({ IPv4, name, country_name, latitude, longitude, avatar });

  word_instance = await word_instance.save();
  res.send(word_instance);
});
module.exports = router;

