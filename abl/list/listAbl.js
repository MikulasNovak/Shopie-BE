const listDao = require("../../dao/listDao.js");

async function listAbl(req, res) {
  try {
    const listList = listDao.list();
    res.json(listList);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = listAbl;
