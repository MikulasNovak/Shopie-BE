const express = require("express");
const router = express.Router();
const listAbl = require("../abl/list/listAbl");
const createAbl = require("../abl/list/createAbl");
const getAbl = require("../abl/list/getAbl");
const removeAbl = require("../abl/list/removeAbl");
const archiveAbl = require("../abl/list/archiveAbl");
const updateAbl = require("../abl/list/updateAbl");

router.get("/list", (req, res) => {
  listAbl(req, res);
});
router.get("/get", (req, res) => {
  getAbl(req, res);
});
router.post("/create", (req, res) => {
  createAbl(req, res);
});
router.delete("/remove", (req, res) => {
  removeAbl(req, res);
});
router.post("/archive", (req, res) => {
  archiveAbl(req, res);
});
router.post("/update", (req, res) => {
  updateAbl(req, res);
});
module.exports = router;
