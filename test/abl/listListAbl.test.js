const listListAbl = require("../../abl/list/listListAbl.js");
const listDao = require("../../dao/listDao.js");

jest.mock("../../dao/listDao.js");

describe("listListAbl", () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  it("should return a list of items when successful", async () => {
    const mockList = [
      { id: "1", name: "Item 1" },
      { id: "2", name: "Item 2" },
    ];
    listDao.listList.mockReturnValue(mockList);

    await listListAbl(req, res);

    expect(res.json).toHaveBeenCalledWith(mockList);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should return 500 if an error occurs", async () => {
    const error = new Error("Database error");
    listDao.listList.mockImplementation(() => {
      throw error;
    });

    await listListAbl(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: error.message,
    });
  });
});
