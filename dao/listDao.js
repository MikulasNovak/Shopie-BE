const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const listFolderPath = path.join(__dirname, "../storage", "list");

function get(list_id) {
  try {
    const listFile = path.join(listFolderPath, `${list_id}.json`); //list FILE
    const listData = fs.readFileSync(listFile, "utf8");
    return JSON.parse(listData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadList", message: error.message };
  }
}

function create(list) {
  try {
    list.id = crypto.randomBytes(16).toString("hex"); // ID GENERATION
    list.memberList = [];
    list.itemList = [];
    list.archived = false;
    const filePath = path.join(listFolderPath, `${list.id}.json`);
    const fileData = JSON.stringify(list);
    fs.writeFileSync(filePath, fileData, "utf8");
    return list;
  } catch (error) {
    throw { code: "failedToCreateList", message: error.message };
  }
}

function update(list) {
  try {
    const listCurrent = get(list.id);
    if (!listCurrent) {
      return null;
    }
    const listNew = { ...listCurrent, ...list }; 
    const filePath = path.join(listFolderPath, `${list.id}.json`);
    const fileData = JSON.stringify(listNew);
    fs.writeFileSync(filePath, fileData, "utf8");
    return listNew;
  } catch (error) {
    throw { code: "failedToUpdateList", message: error.message };
  }
}

function archive(list) {
  try {
    const listCurrent = get(list.id);
    if (!listCurrent) {
      return null;
    }
    listCurrent.archived = true;
    const filePath = path.join(listFolderPath, `${listCurrent.id}.json`);
    const fileData = JSON.stringify(listCurrent);
    fs.writeFileSync(filePath, fileData, "utf8");
    return listCurrent;
  } catch (error) {
    throw { code: "failedToArchiveList", message: error.message };
  }
}

function remove(list_id) {
  try {
    const filePath = path.join(listFolderPath, `${list_id}.json`);
    fs.unlinkSync(filePath);

    return {};
  } catch (error) {
    if (error.code === "ENOENT") {
      return {};
    }
    throw { code: "failedToRemoveList", message: error.message };
  }
}

function list() {
  try {
    const files = fs.readdirSync(listFolderPath);
    const listList = files.map((file) => {
      const fileData = fs.readFileSync(path.join(listFolderPath, file), "utf8");
      return JSON.parse(fileData);
    });
    return listList;
  } catch (error) {
    throw { code: "failedToListLists", message: error.message };
  }
}

module.exports = {
  get,
  create,
  update,
  remove,
  list,
  archive,
};
