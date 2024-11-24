const listDao = require("../../dao/listDao.js");


async function archiveListAbl(req, res) {
  try {
    const list_id = req.params.list_id; // Extract list_id from URL

    const listUpdated = listDao.archiveList(list_id);

    if (!listUpdated) {
      res.status(404).json({
        code: "listNotFound",
        message: `list not found`,
      });
      return;
    }

    res.json(listUpdated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = archiveListAbl;
