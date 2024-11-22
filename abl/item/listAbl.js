const itemDao = require("../../dao/itemDao.js");

async function itemAbl(req, res) {
    try {
        const itemList = itemDao.item();
        res.json(itemList);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = itemAbl;
