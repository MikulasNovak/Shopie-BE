const listDao = require("../../dao/listDao.js");

async function resolveItemAbl(req, res) {
  try {
    const list_id = req.params.list_id; // Extract list_id from URL
    const item_id = req.params.item_id; // Extract list_id from URL

    const list = listDao.getList(list_id);
    if (!list) {
      res.status(404).json({
        code: "listNotFound",
        message: "List does not exist",
      });
      return;
    }

    const resolvedItem = listDao.resolveItem(list_id, item_id);
    res.status(201).json(resolvedItem); // Return the newly created item
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = resolveItemAbl;
