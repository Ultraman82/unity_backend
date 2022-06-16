const winston = require("winston");
const auth = require("../middleware/auth");
const { Blacklist } = require("../models/blacklist");
const Joi = require("joi");
const express = require("express");
const router = express.Router();
var regex = require('./regex.js');

// router.get("/", auth, async (req, res, next) => {
router.get("/", async (req, res, next) => {
  try {
    const list = await Blacklist.find();
    res.send(list);
  } catch (error) {
    res.status(500).send("Error: " + error.message);
    winston.error(error.message);
  }
});

router.post("/", async (req, res) => {
  const schema = Joi.object({
    list_items: Joi.array().required(),
    category: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const { list_items, category } = req.body;

  let list_instance = new Blacklist({ list_items, category });

  list_instance = await list_instance.save();
  res.send(list_instance);
});

router.post("/update", async (req, res) => {
  const schema = Joi.object({
    word_list: Joi.array().required(),
  });
  const { error } = schema.validate(req.body);

  let block_list = await Blacklist.findById("626e04cd66fcf57e7cae0a46");

  if (!block_list) return res.status(404).send("blacklist word not found...");

  const { add_word } = req.body;
  block_list.word_list.push(add_word);
  block_list = await block_list.save()
  res.send(block_list);
});

router.post("/add_word_ban", async (req, res) => {
  const schema = Joi.object({
    word2ban: Joi.array().required(),
  });
  const { error } = schema.validate(req.body);

  let block_list = await Blacklist.findById("626f7deea74ba22e36a14578");

  if (!block_list) return res.status(404).send("blacklist word not found...");
  const { word2ban } = req.body;
  block_list.list_items.push(word2ban);
  block_list = await block_list.save()

  let test_string = '('
  block_list.list_items.forEach(word => {
    test_string = test_string + word + '|'
  });
  let string = test_string.substring(0, test_string.length - 1) + ')'
  regex.setRegex(string)
  res.send(block_list);
});


router.post("/add_user_ban", async (req, res) => {
  const schema = Joi.object({
    user2ban: Joi.array().required(),
  });
  const { error } = schema.validate(req.body);

  let userban_list = await Blacklist.findById("626f7ecea74ba22e36a14579");

  if (!userban_list) return res.status(404).send("user ban list not found...");
  regex.setBannedUsers(userban_list.list_items)
  const { user2ban } = req.body;
  userban_list.list_items.push(user2ban);
  userban_list = await userban_list.save()
  res.send(userban_list);
});

async function initial_word_ban() {
  let initial_ban_word = await Blacklist.findById("626f7deea74ba22e36a14578");
  let test_string = '('
  initial_ban_word.list_items.forEach(word => {
    test_string = test_string + word + '|'
  });
  let string = test_string.substring(0, test_string.length - 1) + ')'
  regex.setRegex(string)
}

initial_word_ban()
module.exports = router;
