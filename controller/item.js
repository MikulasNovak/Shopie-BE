const express = require("express");
const router = express.Router();
const createAbl = require("../abl/item/createAbl");


router.post("/create", (req, res) => {
    createAbl(req, res);
});


module.exports = router;
