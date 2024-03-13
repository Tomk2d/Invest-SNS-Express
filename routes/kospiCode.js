const express = require("express");
const router = express.Router();
const KospiCode = require("../model/KospiCode.js");

router.get("/", (req, res, next) => {
  KospiCode.find()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      return next(err);
    });
});

module.exports = router;
