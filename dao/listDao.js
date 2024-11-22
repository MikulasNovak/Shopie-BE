const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const listFolderPath = path.join(__dirname, "../storage", "list");
const userDao = require("./userDao.js");

function getList(list_id) {
  try {
    const listFile = path.join(listFolderPath, `${list_id}.json`); //list FILE
    const listData = fs.readFileSync(listFile, "utf8");
    return JSON.parse(listData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadList", message: error.message };
  }
}

function createList(list) {
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

function updateList(list) {
  try {
    const listCurrent = getList(list.list_id);
    if (!listCurrent) {
      return null;
    }
    const listNew = { ...listCurrent, ...list };
    const filePath = path.join(listFolderPath, `${list.list_id}.json`);
    const fileData = JSON.stringify(listNew);
    fs.writeFileSync(filePath, fileData, "utf8");
    return listNew;
  } catch (error) {
    throw { code: "failedToUpdateList", message: error.message };
  }
}

function archiveList(list_id) {
  try {
    const listCurrent = getList(list_id);
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

function removeList(list_id) {
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

function listList() {
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
function createItem(list_id, item) {
  try {
    const listFilePath = path.join(listFolderPath, `${list_id}.json`);
    if (!fs.existsSync(listFilePath)) {
      throw {
        code: "listNotFound",
        message: `List with ID ${list_id} not found.`,
      };
    }

    const listData = fs.readFileSync(listFilePath, "utf8");
    const list = JSON.parse(listData);
    item.id = crypto.randomBytes(16).toString("hex"); // Generate unique ID
    item.resolved = false;
    list.itemList.push(item);
    const updatedListData = JSON.stringify(list, null, 2); // Pretty print for readability
    fs.writeFileSync(listFilePath, updatedListData, "utf8");

    return item;
  } catch (error) {
    throw { code: "failedToAddItemToList", message: error.message };
  }
}
function removeItem(list_id, item_id) {
  try {
    const list = getList(list_id);
    if (!list) {
      throw {
        code: "listNotFound",
        message: `List with ID ${list_id} not found.`,
      };
    }
    const itemIndex = list.itemList.findIndex((item) => item.id === item_id);
    if (itemIndex === -1) {
      throw {
        code: "itemNotFound",
        message: `Item with ID ${item_id} not found in the list.`,
      };
    }
    list.itemList.splice(itemIndex, 1);
    const updatedListData = JSON.stringify(list, null, 2);
    const listFilePath = path.join(listFolderPath, `${list_id}.json`);
    fs.writeFileSync(listFilePath, updatedListData, "utf8");

    return {
      success: true,
      message: `Item with ID ${item_id} removed from the list.`,
    };
  } catch (error) {
    throw { code: "failedToRemoveItemFromList", message: error.message };
  }
}

function addMember(list_id, user_id) {
  try {
    const listFilePath = path.join(listFolderPath, `${list_id}.json`);
    if (!fs.existsSync(listFilePath)) {
      throw {
        code: "listNotFound",
        message: `List with ID ${list_id} not found.`,
      };
    }

    const listData = fs.readFileSync(listFilePath, "utf8");
    const list = JSON.parse(listData);
    const user = userDao.get(user_id);
    //console.log(user);
    list.memberList.push(user);
    const updatedListData = JSON.stringify(list, null, 2);
    fs.writeFileSync(listFilePath, updatedListData, "utf8");

    return user;
  } catch (error) {
    throw { code: "failedToAddUserToList", message: error.message };
  }
}
function kickMember(list_id, user_id, owner_id) {
  try {
    const list = getList(list_id);
    if (!list) {
      throw {
        code: "listNotFound",
        message: `List with ID ${list_id} not found.`,
      };
    }
    const userIndex = list.memberList.findIndex((user) => user.id === user_id);
    if (userIndex === -1) {
      throw {
        code: "userNotFound",
        message: `User with ID ${user_id} not found in the list.`,
      };
    }
    if (list.owner_id !== owner_id) {
      throw {
        code: "userNotOwner",
        message: `User with ID ${owner_id} is not the owner of the list.`,
      };
    }
    list.memberList.splice(userIndex, 1);
    const updatedListData = JSON.stringify(list, null, 2);
    const listFilePath = path.join(listFolderPath, `${list_id}.json`);
    fs.writeFileSync(listFilePath, updatedListData, "utf8");
    return {
      success: true,
      message: `User with ID ${user_id} removed from the list.`,
    };
  } catch (error) {
    console.error("Error in kickMember:", error);
    throw { code: "failedToRemoveMemberFromList", message: error.message };
  }
}

function leaveMember(list_id, user_id) {
  try {
    const list = getList(list_id);
    if (!list) {
      throw {
        code: "listNotFound",
        message: `List with ID ${list_id} not found.`,
      };
    }
    const userIndex = list.memberList.findIndex((user) => user.id === user_id);
    if (userIndex === -1) {
      throw {
        code: "userNotFound",
        message: `User with ID ${user_id} not found in the list.`,
      };
    }

    list.memberList.splice(userIndex, 1);
    const updatedListData = JSON.stringify(list, null, 2);
    const listFilePath = path.join(listFolderPath, `${list_id}.json`);
    fs.writeFileSync(listFilePath, updatedListData, "utf8");
    return {
      success: true,
      message: `User with ID ${user_id} left the list.`,
    };
  } catch (error) {
    console.error("Error in kickMember:", error);
    throw { code: "failedToLeaveMemberFromList", message: error.message };
  }
}
function resolveItem(list_id, item_id) {
  try {
    const list = getList(list_id);
    if (!list) {
      throw {
        code: "listNotFound",
        message: `List with ID ${list_id} not found.`,
      };
    }
    const itemIndex = list.itemList.findIndex((item) => item.id === item_id);
    if (itemIndex === -1) {
      throw {
        code: "itemNotFound",
        message: `Item with ID ${item_id} not found in the list.`,
      };
    }
    list.itemList[itemIndex].resolved = true;
    const updatedListData = JSON.stringify(list, null, 2);
    const listFilePath = path.join(listFolderPath, `${list_id}.json`);
    fs.writeFileSync(listFilePath, updatedListData, "utf8");
    return {
      success: true,
      message: `Item with ID ${item_id} has been marked as resolved.`,
    };
  } catch (error) {
    throw { code: "failedToMarkItemAsResolved", message: error.message };
  }
}

function updateItem(list_id, item) {
  try {
    const list = getList(list_id);

    if (!list) {
      throw {
        code: "listNotFound",
        message: `List with ID ${list_id} not found.`,
      };
    }

    if (!list.itemList || !Array.isArray(list.itemList)) {
      throw {
        code: "invalidItemList",
        message: "Item list is missing or invalid.",
      };
    }
    const itemIndex = list.itemList.findIndex(
      (listItem) => listItem.id === item.item_id
    );

    if (itemIndex === -1) {
      console.error(
        "Item not found. Available IDs:",
        list.itemList.map((i) => i.id)
      );
      throw {
        code: "itemNotFound",
        message: `Item with ID ${item.item_id} not found in the list.`,
      };
    }

    list.itemList[itemIndex] = { ...list.itemList[itemIndex], ...item };

    const updatedListData = JSON.stringify(list, null, 2);
    const listFilePath = path.join(listFolderPath, `${list_id}.json`);
    fs.writeFileSync(listFilePath, updatedListData, "utf8");

    return {
      success: true,
      message: `Item with ID ${item.id} has been updated successfully.`,
    };
  } catch (error) {
    console.error("Error updating item:", error);
    throw { code: "failedToUpdateItem", message: error.message };
  }
}

module.exports = {
  getList,
  createList,
  updateList,
  removeList,
  listList,
  archiveList,
  leaveMember,
  kickMember,
  createItem,
  removeItem,
  addMember,
  resolveItem,
  updateItem,
};
