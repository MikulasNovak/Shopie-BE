const listDao = require("../../dao/listDao.js");

async function removeItemAbl(req, res) {
  try {
    const item_id = req.params.item_id;
    const list_id = req.params.list_id; // Extract list_id from URL
    // console.log(list_id);

    if (!listDao.getList(list_id)) {
      res.status(400).json({
        code: "listDoesNotExist",
        message: "list does not exist",
      });
      return;
    }

    listDao.removeItem(list_id, item_id);

    res.json({
      code: "itemRemoved",
      message: `Item with ID ${item_id} has been successfully removed.`,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = removeItemAbl;
