const Ajv = require("ajv");
const ajv = new Ajv();
const itemDao = require("../../dao/itemDao.js");

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

        const item = itemDao.get(reqParam.id);

        if (!itemDao.get(reqParam.id)) {
            res.status(404).json({
                code: "itemNotFound",
                message: `item not found`,
            });
            return;
        }

        res.json(item);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = getAbl;
