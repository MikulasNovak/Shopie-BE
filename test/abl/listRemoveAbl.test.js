const removeListAbl = require("../../abl/list/listRemoveAbl.js");
const listDao = require("../../dao/listDao.js");

jest.mock("../../dao/listDao.js");

describe("removeListAbl", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {
        list_id: "123",
      },
      body: {},
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  it("should return 400 if the input is not valid", async () => {
    req.body = {};
    await removeListAbl(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      code: "dtoInIsNotValid",
      message: "dtoIn is not valid",
      validationError: expect.any(Array),
    });
  });

  it("should return 400 if the list does not exist", async () => {
    req.body = { owner_id: "user123" };
    listDao.getList.mockReturnValue(null);
    await removeListAbl(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      code: "dtoInIsNotValid",
      message: "list does not exist",
    });
  });

  it("should return 400 if the user is not the owner", async () => {
    req.body = { owner_id: "user123" };
    listDao.getList.mockReturnValue({ owner_id: "user456" });
    await removeListAbl(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      code: "userIsNotOwner",
      message: "user is not owner",
    });
  });

  it("should remove the list when input is valid and user is the owner", async () => {
    req.body = { owner_id: "user123" };
    listDao.getList.mockReturnValue({ owner_id: "user123" });
    await removeListAbl(req, res);
    expect(listDao.removeList).toHaveBeenCalledWith("123");
    expect(res.json).toHaveBeenCalledWith({
      code: "listRemoved",
      message: `List with ID 123 has been successfully removed.`,
    });
  });

  it("should return 500 if an unexpected error occurs", async () => {
    const error = new Error("Unexpected error");
    req.body = { owner_id: "user123" };
    listDao.getList.mockReturnValue({ owner_id: "user123" });
    listDao.removeList.mockImplementation(() => {
      throw error;
    });
    await removeListAbl(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: error.message,
    });
  });
});
