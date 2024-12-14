const getListAbl = require("../../abl/list/listGetAbl.js");
const listDao = require("../../dao/listDao.js");

jest.mock("../../dao/listDao.js");

describe("getListAbl", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {
        list_id: "123",
      },
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  it("should return a list when the list is found", async () => {
    const mockList = { id: "123", name: "Test List" };
    listDao.getList.mockReturnValue(mockList);

    await getListAbl(req, res);

    expect(res.json).toHaveBeenCalledWith(mockList);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should return 404 when the list is not found", async () => {
    listDao.getList.mockReturnValue(null);

    await getListAbl(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      code: "listNotFound",
      message: "list not found",
    });
  });

  it("should return 500 if an error occurs", async () => {
    const error = new Error("Database error");
    listDao.getList.mockImplementation(() => {
      throw error;
    });

    await getListAbl(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: error.message,
    });
  });
});
