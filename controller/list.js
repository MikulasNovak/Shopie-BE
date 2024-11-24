const express = require("express");
const router = express.Router();
const listListAbl = require("../abl/list/listListAbl");
const createListAbl = require("../abl/list/createListAbl");
const getListAbl = require("../abl/list/getListAbl");
const removeListAbl = require("../abl/list/removeListAbl");
const archiveListAbl = require("../abl/list/archiveListAbl");
const updateListAbl = require("../abl/list/updateListAbl");
const createItemAbl = require("../abl/list/createItemAbl");
const removeItemAbl = require("../abl/list/removeItemAbl");
const addMemberListAbl = require("../abl/list/addMemberListAbl");
const kickMemberListAbl = require("../abl/list/kickMemberListAbl");
const leaveMemberListAbl = require("../abl/list/leaveMemberListAbl");
const resolveItemAbl = require("../abl/list/resolveItemAbl");
const updateItemAbl = require("../abl/list/updateItemAbl");
const listItemsByListAbl = require("../abl/list/listItemsByListAbl");

router.get("/list", (req, res) => {
  listListAbl(req, res);
});
router.get("/:list_id/get", (req, res) => {
  getListAbl(req, res);
});
router.post("/create", (req, res) => {
  createListAbl(req, res);
});
router.delete("/:list_id/remove", (req, res) => {
  removeListAbl(req, res);
});
router.post("/:list_id/archive", (req, res) => {
  archiveListAbl(req, res);
});
router.post("/:list_id/update", (req, res) => {
  updateListAbl(req, res);
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
router.get("/:list_id/item/list", (req, res) => {
  listItemsByListAbl(req, res);
});

module.exports = router;
