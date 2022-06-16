const winston = require("winston");
const auth = require("../middleware/auth");
const { Boardlist } = require("../models/boardlist");
const Joi = require("joi");
const express = require("express");
const router = express.Router();


// router.get("/", auth, async (req, res, next) => {
router.get("/", async (req, res, next) => {
  try {
    const list = await Boardlist.find();
    res.send(list);
    console.log("test from boardlist get")
  } catch (error) {
    res.status(500).send("Error: " + error.message);
    winston.error(error.message);
  }
});

router.post("/", async (req, res) => {
  const schema = Joi.object({
    url: Joi.string().required(),
    type_: Joi.string().required(),
    name: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const { url, type_, name } = req.body;

  let list_instance = new Boardlist({ url, type_, name });

  list_instance = await list_instance.save();
  res.send(list_instance);
});

router.put("/update", async (req, res) => {
  const schema = Joi.object({
    url: Joi.string().required(),
    type_: Joi.string().required(),
    name: Joi.string().required(),
  });
  const { url, type_ } = req.body;
  const { error } = schema.validate(req.body);

  let boardlist = await Boardlist.findOne({ type_: type_ });

  if (!boardlist) return res.status(404).send("boardlist word not found...");

  boardlist.url = url
  boardlist = await boardlist.save()
  res.send(boardlist);
});

module.exports = router;
