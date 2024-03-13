const express = require("express");
const router = express.Router();
const KosdaqCode = require("../model/KosdaqCode.js");

router.get("/", (req, res, next) => {
  KosdaqCode.find()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      return next(err);
    });
});

module.exports = router;
