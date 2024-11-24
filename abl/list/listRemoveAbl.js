const Ajv = require("ajv");
const ajv = new Ajv();
const listDao = require("../../dao/listDao.js");
const userDao = require("../../dao/userDao.js");

const schema = {
  type: "object",
  properties: {
    owner_id: { type: "string" },
  },
  required: ["owner_id"],
  additionalProperties: false,
};

async function removeListAbl(req, res) {
  try {
    const list_id = req.params.list_id; // Extract list_id from URL

    const valid = ajv.validate(schema, req.body);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }
    const list = listDao.getList(list_id);

    if (!list) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "list does not exist",
      });
      return;
    }
    if (list.owner_id !== req.body.owner_id) {
      res.status(400).json({
        code: "userIsNotOwner",
        message: "user is not owner",
      });
      return;
    }

    listDao.removeList(list_id);

    res.json({
      code: "listRemoved",
      message: `List with ID ${list_id} has been successfully removed.`,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = removeListAbl;
