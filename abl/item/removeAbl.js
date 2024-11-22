const Ajv = require("ajv");
const ajv = new Ajv();
const itemDao = require("../../dao/itemDao.js");
const listDao = require("../../dao/listDao.js");



const schema = {
    type: "object",
    properties: {
        id: { type: "string" },
        list_id: { type: "string" }
    },
    required: ["list_id", "id"],
    additionalProperties: false,
};

async function removeAbl(req, res) {
    try {
        const reqParam = req.query?.id ? req.query : req.body;

        const valid = ajv.validate(schema, reqParam);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                message: "dtoIn is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        if (!itemDao.get(reqParam.id)) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                message: "item does not exist",
            });
            return;
        }
        if (listDao.get(reqParam.list_id)) {
            res.status(400).json({
                code: "listDoesNotExist",
                message: "List does not exist",
            });
            return;
        }

        itemDao.remove(reqParam.id);

        res.json({});
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = removeAbl;
