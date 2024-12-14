const createListAbl = require("../../abl/list/listCreateAbl.js");
const listDao = require("../../dao/listDao.js");
const userDao = require("../../dao/userDao.js");

jest.mock("../../dao/listDao.js");
jest.mock("../../dao/userDao.js");

describe("createListAbl", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  it("should create a list when input is valid and owner exists", async () => {
    const mockList = { owner_id: "123", title: "Test List" };
    req.body = mockList;
    userDao.get.mockReturnValue(true);
    listDao.createList.mockReturnValue(mockList);

    await createListAbl(req, res);

    expect(res.json).toHaveBeenCalledWith(mockList);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should return 400 if the input is not valid", async () => {
    req.body = { title: "Test List" };

    await createListAbl(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      code: "dtoInIsNotValid",
      message: "dtoIn is not valid",
      validationError: expect.any(Array),
    });
  });

  it("should return 400 if the owner does not exist", async () => {
    req.body = { owner_id: "123", title: "Test List" };
    userDao.get.mockReturnValue(null);

    await createListAbl(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      code: "ownerNotFound",
      message: "Owner does not exist",
    });
  });

  it("should return 500 if an unexpected error occurs", async () => {
    const error = new Error("Unexpected error");
    req.body = { owner_id: "123", title: "Test List" };
    userDao.get.mockReturnValue(true);
    listDao.createList.mockImplementation(() => {
      throw error;
    });

    await createListAbl(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: error.message,
    });
  });
});
