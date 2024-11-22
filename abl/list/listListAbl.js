const listDao = require("../../dao/listDao.js");

async function listListAbl(req, res) {
  try {
    const listList = listDao.listList();
    res.json(listList);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = listListAbl;
