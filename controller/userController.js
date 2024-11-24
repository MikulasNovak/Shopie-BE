const express = require("express");
const router = express.Router();
const userListAbl = require("../abl/user/userListAbl");
const userRegisterAbl = require("../abl/user/userRegisterAbl");
const userGetAbl = require("../abl/user/userGetAbl");

router.get("/list", (req, res) => {
  userListAbl(req, res);
});
router.post("/register", (req, res) => {
  userRegisterAbl(req, res);
});
router.get("/get", (req, res) => {
  userGetAbl(req, res);
});

module.exports = router;
