const Ajv = require("ajv");
const ajv = new Ajv();

const userDao = require("../../dao/userDao.js");

const schema = {
  type: "object",
  properties: {
    username: { type: "string" },
    email: { type: "string" },
    password:  {type: "string"}
  },
  required: ["username", "email"],
  additionalProperties: false,
};

async function registerAbl(req, res) {
  try {
    let user = req.body;

    const valid = ajv.validate(schema, user);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    /*
    if (!userDao.get(user.owner_id)) {
      res.status(400).json({
        code: "ownerNotFound",
        message: "Owner does not exist",
      });
      return;
    }*/

    user = await userDao.register(user);
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = registerAbl;
