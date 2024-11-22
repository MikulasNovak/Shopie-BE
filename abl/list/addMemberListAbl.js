const Ajv = require("ajv");
const ajv = new Ajv();

const listDao = require("../../dao/listDao.js");

const schema = {
    type: "object",
    properties: {
        id: { type: "string" }, // Item title is required
    },
    required: ["id"],
    additionalProperties: false,
};

async function addMemberListAbl(req, res) {
    try {
        const list_id = req.params.list_id; // Extract list_id from URL
        const user = req.body; // Extract item details from request body

        // Validate the item against the schema
        const valid = ajv.validate(schema, user);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                message: "dtoIn is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        // Check if the list exists
        const list = listDao.getList(list_id);
        if (!list) {
            res.status(404).json({
                code: "listNotFound",
                message: "List does not exist",
            });
            return;
        }

        // Create the item and add it to the list
        const newMember = listDao.addMember(list_id, user.id);
        res.status(201).json(newMember); // Return the newly created item
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = addMemberListAbl;
