const Ajv = require("ajv");
const ajv = new Ajv();
const listDao = require("../../dao/listDao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
  additionalProperties: false,
};

async function getAbl(req, res) {
  try {
    const reqParam = req.query?.id ? req.query : req.body;

    const validation = ajv.validate(schema, reqParam);
    if (!validation) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    const list = listDao.get(reqParam.id);

    if (!listDao.get(reqParam.id)) {
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

module.exports = getAbl;
