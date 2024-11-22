const Ajv = require("ajv");
const ajv = new Ajv();

const listDao = require("../../dao/listDao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string" },
    title: { type: "string" },
    owner_id: { type: "integer" },
    archived: { type: "boolean" },
  },
  required: ["id"],
  additionalProperties: false,
};

async function updateListAbl(req, res) {
  try {
    let list = req.body;

    const valid = ajv.validate(schema, list);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    const listUpdated = listDao.updateList(list);

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

module.exports = updateListAbl;