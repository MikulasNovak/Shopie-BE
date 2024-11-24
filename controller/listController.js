const express = require("express");
const router = express.Router();
const listListAbl = require("../abl/list/listListAbl");
const listCreateAbl = require("../abl/list/listCreateAbl");
const listGetAbl = require("../abl/list/listGetAbl");
const listRemoveAbl = require("../abl/list/listRemoveAbl");
const listArchiveAbl = require("../abl/list/listArchiveAbl");
const listUpdateAbl = require("../abl/list/listUpdateAbl");
const itemCreateAbl = require("../abl/list/itemCreateAbl");
const itemRemoveAbl = require("../abl/list/itemRemoveAbl");
const memberAddAbl = require("../abl/list/memberAddAbl");
const memberKickAbl = require("../abl/list/memberKickAbl");
const memberLeaveAbl = require("../abl/list/memberLeaveAbl");
const itemResolveAbl = require("../abl/list/itemResolveAbl");
const itemUpdateAbl = require("../abl/list/itemUpdateAbl");
const itemListAbl = require("../abl/list/itemListAbl");

router.get("/list", (req, res) => {
  listListAbl(req, res);
});
router.get("/:list_id/get", (req, res) => {
  listGetAbl(req, res);
});
router.post("/create", (req, res) => {
  listCreateAbl(req, res);
});
router.delete("/:list_id/remove", (req, res) => {
  listRemoveAbl(req, res);
});
router.post("/:list_id/archive", (req, res) => {
  listArchiveAbl(req, res);
});
router.post("/:list_id/update", (req, res) => {
  listUpdateAbl(req, res);
});
router.post("/:list_id/item/create", (req, res) => {
  itemCreateAbl(req, res);
});
router.post("/:list_id/item/:item_id/resolve", (req, res) => {
  itemResolveAbl(req, res);
});
router.delete("/:list_id/item/:item_id/remove", (req, res) => {
  itemRemoveAbl(req, res);
});
router.post("/:list_id/item/:item_id/update", (req, res) => {
  itemUpdateAbl(req, res);
});
router.post("/:list_id/user/:user_id/add", (req, res) => {
  memberAddAbl(req, res);
});
router.post("/:list_id/user/:user_id/kick", (req, res) => {
  memberKickAbl(req, res);
});
router.post("/:list_id/user/:user_id/leave", (req, res) => {
  memberLeaveAbl(req, res);
});
router.get("/:list_id/item/list", (req, res) => {
  itemListAbl(req, res);
});

module.exports = router;
