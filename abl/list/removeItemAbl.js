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

async function removeItemAbl(req, res) {
    try {
        const reqParam = req.query?.id ? req.query : req.body;

        const list_id = req.params.list_id; // Extract list_id from URL
        // console.log(list_id);

        const valid = ajv.validate(schema, reqParam);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                message: "dtoIn is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        if (!listDao.getList(list_id)) {
            res.status(400).json({
                code: "listDoesNotExist",
                message: "list does not exist",
            });
            return;
        }

        listDao.removeItem(list_id, reqParam.id);

        res.json({});
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = removeItemAbl;
