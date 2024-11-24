const listDao = require("../../dao/listDao.js");

async function getListAbl(req, res) {
  try {
    const list_id = req.params.list_id;

    const list = listDao.getList(list_id);

    if (!list) {
      res.status(404).json({
        code: "listNotFound",
        message: `list not found`,
      });
      return;
    }

    res.json(list);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = getListAbl;
