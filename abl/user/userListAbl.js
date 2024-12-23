const userDao = require("../../dao/userDao.js");

async function listAbl(req, res) {
  try {
    const userList = userDao.list();
    res.json(userList);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = listAbl;
