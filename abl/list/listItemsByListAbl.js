const listDao = require("../../dao/listDao.js");

async function itemListByListAbl(req, res) {
  try {
    const list_id = req.params.list_id;

    const list = listDao.getList(list_id);
    if (!list) {
      res.status(404).json({
        code: "listNotFound",
        message: "List does not exist",
      });
      return;
    }

    const itemListByList = listDao.listItems(list_id);
    res.json(itemListByList);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = itemListByListAbl;
