import { UserHandler } from "../../src/routes/user.router";
import { Request, Response } from "express";
import { UserService } from "../../src/services/user.service";

jest.mock("../../src/services/user.service", () => {
  return {
    UserService: {
      login: jest.fn(),
      saveUser: jest.fn(),
    },
  };
});

const mockResponse = () => {
  const res = {} as unknown as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe("testing the user route for fails", () => {
  // let loginMock = jest.fn;

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("it should return 400 (login api)", async () => {
    const mockRequest = {
      headers: {},
      body: {
        email: "a@b.com",
      },
    } as unknown as Request;
    const mockRes = mockResponse();
    const response = await UserHandler.userLogin(mockRequest, mockRes);
    expect(response?.status).toHaveBeenCalledWith(400);
    expect(response?.json).toHaveBeenCalled();
  });

  it("it should return 401 (login api)", async () => {
    UserService.login = jest
      .fn()
      .mockRejectedValue(new Error("invalid credentials"));

    const mockRequest = {
      headers: {},
      body: {
        email: "abarpute66@gmail.com",
        password: "pass",
      },
    } as unknown as Request;
    const mockRes = mockResponse();

    const response = await UserHandler.userLogin(mockRequest, mockRes);
    expect(response?.status).toHaveBeenCalledWith(401);
    expect(response?.json).toHaveBeenCalledTimes(1);
    expect(response?.json).toHaveBeenCalledWith({
      status: "success",
      message: "incorrect username or password",
      data: {},
    });
  });

  it("it should return 401 (login api)", async () => {
    UserService.login = jest
      .fn()
      .mockRejectedValue(new Error("user not found"));

    const mockRequest = {
      headers: {},
      body: {
        email: "abarpute66@gmail.com",
        password: "pass",
      },
    } as unknown as Request;
    const mockRes = mockResponse();

    const response = await UserHandler.userLogin(mockRequest, mockRes);
    expect(response?.status).toHaveBeenCalledWith(401);
    expect(response?.json).toHaveBeenCalledTimes(1);
    expect(response?.json).toHaveBeenCalledWith({
      status: "success",
      message: "incorrect username or password",
      data: {},
    });
  });

  it("it should return 500 (login api)", async () => {
    UserService.login = jest.fn().mockRejectedValue(new Error("server error"));

    const mockRequest = {
      headers: {},
      body: {
        email: "abarpute66@gmail.com",
        password: "pass",
      },
    } as unknown as Request;
    const mockRes = mockResponse();

    const response = await UserHandler.userLogin(mockRequest, mockRes);
    expect(response?.status).toHaveBeenCalledWith(500);
    expect(response?.json).toHaveBeenCalledTimes(1);
    expect(response?.json).toHaveBeenCalledWith({
      status: "failed",
      message: "internal server error",
      data: {},
    });
  });

  it("it should return 400 (create user api)", async () => {
    const mockRequest = {
      headers: {},
      body: {
        email: "a@b.com",
      },
    } as unknown as Request;
    const mockRes = mockResponse();
    const response = await UserHandler.createUser(mockRequest, mockRes);
    expect(response?.status).toHaveBeenCalledWith(400);
    expect(response?.json).toHaveBeenCalled();
  });

  it("it should return 500 (create user api)", async () => {
    UserService.saveUser = jest
      .fn()
      .mockRejectedValue(new Error("server error"));

    const mockRequest = {
      headers: {},
      body: {
        email: "abarpute66@gmail.com",
        password: "pass",
        name: "akshay",
      },
    } as unknown as Request;
    const mockRes = mockResponse();

    const response = await UserHandler.createUser(mockRequest, mockRes);
    expect(response?.status).toHaveBeenCalledWith(500);
    expect(response?.json).toHaveBeenCalledTimes(1);
    expect(response?.json).toHaveBeenCalledWith({
      status: "failed",
      message: "internal server error",
      data: {},
    });
  });
});
