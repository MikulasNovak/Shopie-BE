const express = require("express");
const router = express.Router();
const listAbl = require("../abl/user/listAbl");
const registerAbl = require("../abl/user/registerAbl");
const getAbl = require("../abl/user/getAbl");

router.get("/list", (req, res) => {
  listAbl(req, res);
});
router.post("/register", (req, res) => {
  registerAbl(req, res);
});
router.get("/get", (req, res) => {
  getAbl(req, res);
});

module.exports = router;
