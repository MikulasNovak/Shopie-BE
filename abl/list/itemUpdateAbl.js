const Ajv = require("ajv");
const ajv = new Ajv();

const listDao = require("../../dao/listDao.js");

const schema = {
  type: "object",
  properties: {
    item_id: { type: "string" },
    title: { type: "string" },
    resolved: { type: "boolean" },
  },
  required: ["item_id"],
  additionalProperties: false,
};

async function updateItemAbl(req, res) {
  try {
    let item = req.body;
    item.item_id = req.params.item_id;
    const list_id = req.params.list_id;

    if (!listDao.getList(list_id)) {
      res.status(400).json({
        code: "listDoesNotExist",
        message: "list does not exist",
        validationError: ajv.errors,
      });
      return;
    }

    const valid = ajv.validate(schema, item);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    const itemUpdated = listDao.updateItem(list_id, item);
    if (!itemUpdated) {
      res.status(404).json({
        code: "listNotFound",
        message: `list not found`,
      });
      return;
    }

    res.json(itemUpdated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = updateItemAbl;
