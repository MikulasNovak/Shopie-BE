const listDao = require("../../dao/listDao.js");

async function addMemberListAbl(req, res) {
  try {
    const list_id = req.params.list_id;
    const user_id = req.params.user_id;

    const list = listDao.getList(list_id);
    if (!list) {
      res.status(404).json({
        code: "listNotFound",
        message: "List does not exist",
      });
      return;
    }
    const newMember = listDao.addMember(list_id, user_id);
    res.status(201).json(newMember);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = addMemberListAbl;
