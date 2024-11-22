const Ajv = require("ajv");
const ajv = new Ajv();

const listDao = require("../../dao/listDao.js");
const userDao = require("../../dao/userDao.js");

const schema = {
  type: "object",
  properties: {
    owner_id: { type: "integer" },
    title: { type: "string" },
  },
  required: ["owner_id", "title"],
  additionalProperties: false,
};

async function createAbl(req, res) {
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

    /*
    if (!userDao.get(list.owner_id)) {
      res.status(400).json({
        code: "ownerNotFound",
        message: "Owner does not exist",
      });
      return;
    }*/

    list = listDao.create(list);
    res.json(list);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = createAbl;
