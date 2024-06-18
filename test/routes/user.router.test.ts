import { UserHandler } from "../../src/routes/user.router";
import { Request, Response } from "express";
import { UserService } from "../../src/services/user.service";
import { StatusCodes } from "../../src/dtos/StatusCode.dto";

jest.mock("../../src/services/user.service", () => {
  return {
    UserService: {
      login: jest.fn().mockResolvedValue({
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6ImFrc2hheSIsImVtYWlsIjoiYWJhcnB1dGU2NkBnbWFpbC5jb20iLCJpYXQiOjE3MTgxNzMxOTksImV4cCI6MTcxODE3Njc5OX0.Jjyg4PfNT1BXeL8YowG3oQSl4S0bet2hCpXcoIpGm4Y",
        user: {
          name: "akshay",
          email: "abarpute66@gmail.com",
          password: "",
          id: 1,
        },
      }),
      saveUser: jest.fn().mockResolvedValue({
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6ImFrc2hheSIsImVtYWlsIjoiYWJhcnB1dGU2NkBnbWFpbC5jb20iLCJpYXQiOjE3MTgxNzMxOTksImV4cCI6MTcxODE3Njc5OX0.Jjyg4PfNT1BXeL8YowG3oQSl4S0bet2hCpXcoIpGm4Y",
        user: {
          name: "akshay",
          email: "abarpute66@gmail.com",
          password: "",
          id: 1,
        },
      }),
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

describe("testing the user route for success", () => {
  // let loginMock = jest.fn;

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("it should return 200 (login api)", async () => {
    const mockRequest = {
      headers: {},
      body: {
        email: "abarpute66@gmail.com",
        password: "manager",
      },
    } as unknown as Request;
    const mockRes = mockResponse();

    const response = await UserHandler.userLogin(mockRequest, mockRes);
    expect(mockRes?.status).toHaveBeenCalledWith(StatusCodes.Success);
    expect(mockRes?.json).toHaveBeenCalledTimes(1);
    expect(mockRes?.json).toHaveBeenCalledWith({
      status: "success",
      message: "Authenticated",
      data: {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6ImFrc2hheSIsImVtYWlsIjoiYWJhcnB1dGU2NkBnbWFpbC5jb20iLCJpYXQiOjE3MTgxNzMxOTksImV4cCI6MTcxODE3Njc5OX0.Jjyg4PfNT1BXeL8YowG3oQSl4S0bet2hCpXcoIpGm4Y",
        user: {
          name: "akshay",
          email: "abarpute66@gmail.com",
          password: "",
          id: 1,
        },
      },
    });
  });

  it("it should return 201 (create user api)", async () => {
    const mockRequest = {
      headers: {},
      body: {
        name: "Akshay",
        email: "abarpute66@gmail.com",
        password: "manager",
      },
    } as unknown as Request;
    const mockRes = mockResponse();
    const response = await UserHandler.createUser(mockRequest, mockRes);

    expect(mockRes?.status).toHaveBeenCalledWith(StatusCodes.Created);
    expect(mockRes?.json).toHaveBeenCalledTimes(1);
    expect(mockRes?.json).toHaveBeenCalledWith({
      status: "success",
      message: "created",
      data: {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6ImFrc2hheSIsImVtYWlsIjoiYWJhcnB1dGU2NkBnbWFpbC5jb20iLCJpYXQiOjE3MTgxNzMxOTksImV4cCI6MTcxODE3Njc5OX0.Jjyg4PfNT1BXeL8YowG3oQSl4S0bet2hCpXcoIpGm4Y",
        user: {
          name: "akshay",
          email: "abarpute66@gmail.com",
          password: "",
          id: 1,
        },
      },
    });
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
    expect(mockRes?.status).toHaveBeenCalledWith(StatusCodes.BadRequest);
    expect(mockRes?.json).toHaveBeenCalled();
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
    expect(mockRes?.status).toHaveBeenCalledWith(StatusCodes.UnAuthorized);
    expect(mockRes?.json).toHaveBeenCalledTimes(1);
    expect(mockRes?.json).toHaveBeenCalledWith({
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
    expect(mockRes?.status).toHaveBeenCalledWith(StatusCodes.UnAuthorized);
    expect(mockRes?.json).toHaveBeenCalledTimes(1);
    expect(mockRes?.json).toHaveBeenCalledWith({
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
    expect(mockRes?.status).toHaveBeenCalledWith(StatusCodes.ServerError);
    expect(mockRes?.json).toHaveBeenCalledTimes(1);
    expect(mockRes?.json).toHaveBeenCalledWith({
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
    expect(mockRes?.status).toHaveBeenCalledWith(StatusCodes.BadRequest);
    expect(mockRes?.json).toHaveBeenCalled();
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
    expect(mockRes?.status).toHaveBeenCalledWith(StatusCodes.ServerError);
    expect(mockRes?.json).toHaveBeenCalledTimes(1);
    expect(mockRes?.json).toHaveBeenCalledWith({
      status: "failed",
      message: "internal server error",
      data: {},
    });
  });
});
