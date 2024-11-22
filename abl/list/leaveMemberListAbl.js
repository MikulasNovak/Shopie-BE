const listDao = require("../../dao/listDao.js");

async function leaveMemberListAbl(req, res) {
  try {
    const list_id = req.params.list_id; // Extract list_id from URL
    const user_id = req.params.user_id;
    // console.log(list_id);

    if (!listDao.getList(list_id)) {
      res.status(400).json({
        code: "listDoesNotExist",
        message: "list does not exist",
      });
      return;
    }
    listDao.leaveMember(list_id, user_id);

    res.json({});
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = leaveMemberListAbl;
