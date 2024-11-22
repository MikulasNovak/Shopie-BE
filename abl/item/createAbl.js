const Ajv = require("ajv");
const ajv = new Ajv();

const itemDao = require("../../dao/itemDao.js");
const listDao = require("../../dao/listDao.js");

const schema = {
    type: "object",
    properties: {
        title: { type: "string" },
        list_id: { type: "string" },
    },
    required: ["list_id", "title"],
    additionalProperties: false,
};

async function createAbl(req, res) {
    try {
        let item = req.body.item;
        let list = req.body.list_id

        const valid = ajv.validate(schema, { ...item, list_id: req.body.list_id }); if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                message: "dtoIn is not valid",
                validationError: ajv.errors,
            });
            return;
        }


        if (!listDao.get(list)) {
            res.status(400).json({
                code: "listNotFound",
                message: "List does not exist",
            });
            return;
        }

        item = itemDao.create(list, item);
        res.json(item);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = createAbl;
