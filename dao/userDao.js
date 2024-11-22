const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing

const userFolderPath = path.join(__dirname, "../storage", "user");

function get(user_id) {
  try {
    const userFile = path.join(userFolderPath, `${user_id}.json`); //user FILE

    const userData = fs.readFileSync(userFile, "utf8");
    return JSON.parse(userData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadUser", message: error.message };
  }
}

async function hashPassword(password) {
  try {
    if (!password) {
      throw new Error("Password is required");
    }
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds); // Use bcrypt to hash password
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
}

async function register(user) {
  try {
    user.id = crypto.randomBytes(16).toString("hex"); // ID GENERATION
    user.password = await hashPassword(user.password); // Hash the password
    const filePath = path.join(userFolderPath, `${user.id}.json`);
    const fileData = JSON.stringify(user);
    fs.writeFileSync(filePath, fileData, "utf8");
    return user;
  } catch (error) {
    throw { code: "failedToCreateUser", message: error.message };
  }
}

function list() {
  try {
    const files = fs.readdirSync(userFolderPath);
    const userList = files.map((file) => {
      const fileData = fs.readFileSync(path.join(userFolderPath, file), "utf8");
      return JSON.parse(fileData);
    });
    return userList;
  } catch (error) {
    throw { code: "failedToListUsers", message: error.message };
  }
}

module.exports = {
  get,
  register,
  list,
};
