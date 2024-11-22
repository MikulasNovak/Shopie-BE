const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const listFolderPath = path.join(__dirname, "../storage", "list");

function get(item_id) {
    try {
        const itemFile = path.join(itemFolderPath, `${item_id}.json`); //item FILE
        const itemData = fs.readFileSync(itemFile, "utf8");
        return JSON.parse(itemData);
    } catch (error) {
        if (error.code === "ENOENT") return null;
        throw { code: "failedToReaditem", message: error.message };
    }
}


function update(item) {
    try {
        const itemCurrent = get(item.id);
        if (!itemCurrent) {
            return null;
        }
        const itemNew = { ...itemCurrent, ...item };
        const filePath = path.join(itemFolderPath, `${item.id}.json`);
        const fileData = JSON.stringify(itemNew);
        fs.writeFileSync(filePath, fileData, "utf8");
        return itemNew;
    } catch (error) {
        throw { code: "failedToUpdateitem", message: error.message };
    }
}

function archive(item) {
    try {
        const itemCurrent = get(item.id);
        if (!itemCurrent) {
            return null;
        }
        itemCurrent.archived = true;
        const filePath = path.join(itemFolderPath, `${itemCurrent.id}.json`);
        const fileData = JSON.stringify(itemCurrent);
        fs.writeFileSync(filePath, fileData, "utf8");
        return itemCurrent;
    } catch (error) {
        throw { code: "failedToArchiveitem", message: error.message };
    }
}

function remove(item_id) {
    try {
        const filePath = path.join(itemFolderPath, `${item_id}.json`);
        fs.unlinkSync(filePath);

        return {};
    } catch (error) {
        if (error.code === "ENOENT") {
            return {};
        }
        throw { code: "failedToRemoveitem", message: error.message };
    }
}

function item() {
    try {
        const files = fs.readdirSync(itemFolderPath);
        const itemitem = files.map((file) => {
            const fileData = fs.readFileSync(path.join(itemFolderPath, file), "utf8");
            return JSON.parse(fileData);
        });
        return itemitem;
    } catch (error) {
        throw { code: "failedToitemitems", message: error.message };
    }
}

module.exports = {
    get,
    update,
    remove,
    item,
    archive,
};
