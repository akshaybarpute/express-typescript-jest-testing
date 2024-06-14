import { UserHandler } from "../../src/routes/user.router";
import { Request, Response } from "express";

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

  it("it should return 400", async () => {
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
    expect(response?.status).toHaveBeenCalledWith(200);
    expect(response?.json).toHaveBeenCalledTimes(1);
    expect(response?.json).toHaveBeenCalledWith({
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

  it("it should return 200 (create user api)", async () => {
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

    expect(response?.status).toHaveBeenCalledWith(201);
    expect(response?.json).toHaveBeenCalledTimes(1);
    expect(response?.json).toHaveBeenCalledWith({
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
});
