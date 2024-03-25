var express = require("express");
var router = express.Router();
const UseGpt = require('../service/chatBot/chatBot')

router.post("/", async (req, res, next) => {
    try {
      let response = await UseGpt(req.body.prompt);
      res.json({gpt : response});
    } catch (err) {
      console.error(err);
      return next(err);
    }
  });

module.exports = router;