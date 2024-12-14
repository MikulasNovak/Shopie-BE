const fs = require("fs");
const path = require("path");
const listDao = require("../../dao/listDao"); // Adjust this path
const crypto = require("crypto");

// Mocking fs module
jest.mock("fs");
jest.mock("crypto");

describe("listDao", () => {
  describe("getList", () => {
    it("should return the list when the file exists", () => {
      const listData = {
        id: "unique-id",
        name: "Sample List",
        itemList: [],
        memberList: [],
        archived: false,
      };
      fs.readFileSync.mockReturnValueOnce(JSON.stringify(listData));
      const result = listDao.getList("unique-id");
      expect(result).toEqual(listData);
      expect(fs.readFileSync).toHaveBeenCalledWith(
        path.join(__dirname, "../../storage/list/unique-id.json"),
        "utf8"
      );
    });

    it("should return null if the file does not exist", () => {
      fs.readFileSync.mockImplementationOnce(() => {
        throw { code: "ENOENT" }; // simulate file not found
      });
      const result = listDao.getList("non-existent-id");
      expect(result).toBeNull();
    });
  });

  describe("listList", () => {
    it("should return all the lists that exist", () => {
      const filesInDirectory = ["unique-id-1.json", "unique-id-2.json"];
      const listData1 = {
        id: "unique-id-1",
        name: "Sample List 1",
        itemList: [],
        memberList: [],
        archived: false,
      };
      const listData2 = {
        id: "unique-id-2",
        name: "Sample List 2",
        itemList: [],
        memberList: [],
        archived: true,
      };
      fs.readdirSync.mockReturnValueOnce(filesInDirectory);
      fs.readFileSync
        .mockReturnValueOnce(JSON.stringify(listData1))
        .mockReturnValueOnce(JSON.stringify(listData2));
      const result = listDao.listList();
      expect(result).toEqual([listData1, listData2]);
      expect(fs.readdirSync).toHaveBeenCalledWith(
        path.join(__dirname, "../../storage/list")
      );
      expect(fs.readFileSync).toHaveBeenCalledWith(
        path.join(__dirname, "../../storage/list/unique-id-1.json"),
        "utf8"
      );
      expect(fs.readFileSync).toHaveBeenCalledWith(
        path.join(__dirname, "../../storage/list/unique-id-2.json"),
        "utf8"
      );
    });

    it("should return null if no lists exist", () => {
      fs.readdirSync.mockReturnValueOnce([]);
      const result = listDao.listList();
      expect(result).toEqual([]); // Expect an empty array
      expect(fs.readdirSync).toHaveBeenCalledWith(
        path.join(__dirname, "../../storage/list")
      );
    });
  });

  describe("createList", () => {
    it("should return the created list object with generated id and default values", () => {
      const inputList = {
        name: "Sample List",
        itemList: [],
        memberList: [],
        archived: false,
      };
      const mockedId = "a046973ef2fb7fd13f8898f892d9bb7b";
      crypto.randomBytes.mockReturnValueOnce(Buffer.from(mockedId, "hex"));
      fs.writeFileSync.mockImplementationOnce(() => {});
      const result = listDao.createList(inputList);
      const expectedList = {
        ...inputList,
        id: mockedId,
      };
      expect(result).toEqual(expectedList);
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        path.join(__dirname, "../../storage/list", `${mockedId}.json`),
        JSON.stringify(expectedList),
        "utf8"
      );
    });

    it("should throw an error if writing to the file fails", () => {
      const inputList = {
        name: "Sample List",
        itemList: [],
        memberList: [],
        archived: false,
      };

      const mockedId = "d3ded64b3ccd3c13123ed979c6e7e929";
      crypto.randomBytes.mockReturnValueOnce(Buffer.from(mockedId, "hex"));
      fs.writeFileSync.mockImplementationOnce(() => {
        throw new Error("Failed to write file");
      });
      expect(() => listDao.createList(inputList)).toThrowError({
        code: "failedToCreateList",
        message: "Failed to write file",
      });
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        path.join(__dirname, "../../storage/list", `${mockedId}.json`),
        JSON.stringify({
          ...inputList,
          id: mockedId,
        }),
        "utf8"
      );
    });
  });
});
