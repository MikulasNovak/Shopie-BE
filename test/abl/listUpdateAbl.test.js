const updateListAbl = require("../../abl/list/listUpdateAbl.js");
const listDao = require("../../dao/listDao.js");

jest.mock("../../dao/listDao.js");

describe("updateListAbl", () => {
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
    req.body = { title: "Updated Title" };
    listDao.getList.mockReturnValue(true);
    await updateListAbl(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      code: "listNotFound",
      message: "list not found",
    });
  });

  it("should return 400 if the list does not exist", async () => {
    req.body = {
      id: "123",
      title: "Updated Title",
      owner_id: 1,
      archived: false,
    };
    listDao.getList.mockReturnValue(null);
    await updateListAbl(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      code: "listDoesNotExist",
      message: "list does not exist",
    });
  });

  it("should update the list when input is valid", async () => {
    req.body = {
      id: "123",
      title: "Updated Title",
      owner_id: 1,
      archived: false,
    };
    listDao.getList.mockReturnValue(true);
    listDao.updateList.mockReturnValue(req.body);

    await updateListAbl(req, res);

    expect(res.json).toHaveBeenCalledWith(req.body);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should return 404 if the list is not found after update attempt", async () => {
    req.body = {
      id: "123",
      title: "Updated Title",
      owner_id: 1,
      archived: false,
    };
    listDao.getList.mockReturnValue(true);
    listDao.updateList.mockReturnValue(null);

    await updateListAbl(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      code: "listNotFound",
      message: "list not found",
    });
  });

  it("should return 500 if an unexpected error occurs", async () => {
    const error = new Error("Unexpected error");
    req.body = {
      id: "123",
      title: "Updated Title",
      owner_id: 1,
      archived: false,
    };
    listDao.getList.mockReturnValue(true);
    listDao.updateList.mockImplementation(() => {
      throw error;
    });

    await updateListAbl(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: error.message,
    });
  });
});
