const express = require("express");
const router = express.Router();
const listAbl = require("../abl/list/listListAbl");
const createAbl = require("../abl/list/createListAbl");
const getAbl = require("../abl/list/getListAbl");
const removeAbl = require("../abl/list/removeListAbl");
const archiveAbl = require("../abl/list/archiveListAbl");
const updateAbl = require("../abl/list/updateListAbl");
const createItemAbl = require("../abl/list/createItemAbl");
const removeItemAbl = require("../abl/list/removeItemAbl");
const addMemberListAbl = require("../abl/list/addMemberListAbl");
const kickMemberListAbl = require("../abl/list/kickMemberListAbl");
const leaveMemberListAbl = require("../abl/list/leaveMemberListAbl");
const resolveItemAbl = require("../abl/list/resolveItemAbl");
const updateItemAbl = require("../abl/list/updateItemAbl");

router.get("/list", (req, res) => {
  listAbl(req, res);
});
router.get("/:list_id/get", (req, res) => {
  getAbl(req, res);
});
router.post("/create", (req, res) => {
  createAbl(req, res);
});
router.delete("/:list_id/remove", (req, res) => {
  removeAbl(req, res);
});
router.post("/:list_id/archive", (req, res) => {
  archiveAbl(req, res);
});
router.post("/:list_id/update", (req, res) => {
  updateAbl(req, res);
});
router.post("/:list_id/item/create", (req, res) => {
  createItemAbl(req, res);
});
router.post("/:list_id/item/:item_id/resolve", (req, res) => {
  resolveItemAbl(req, res);
});
router.delete("/:list_id/item/:item_id/remove", (req, res) => {
  removeItemAbl(req, res);
});
router.post("/:list_id/item/:item_id/update", (req, res) => {
  updateItemAbl(req, res);
});
router.post("/:list_id/user/:user_id/add", (req, res) => {
  addMemberListAbl(req, res);
});
router.post("/:list_id/user/:user_id/kick", (req, res) => {
  kickMemberListAbl(req, res);
});
router.post("/:list_id/user/:user_id/leave", (req, res) => {
  leaveMemberListAbl(req, res);
});

module.exports = router;
