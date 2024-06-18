import { AddressHandler } from "../../src/routes/address.router";
import { Request, Response } from "express";
import { UserAddressService } from "../../src/services/user.address.service";
import { StatusCodes } from "../../src/dtos/StatusCode.dto";

// jest.mock("../../src/services/user.address.service", () => {
//   return {
//     UserAddressService: {
//       getAddressesByUser: jest.fn(),
//       addAddressForUser: jest.fn(),
//       getAddressById: jest.fn(),
//     },
//   };
// });

const mockResponse = () => {
  const res = {} as unknown as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe("testing address router", () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  it("it should return 201 (addNewAddress api)", async () => {
    const mockRequest = {
      headers: {},
      body: {
        block: "B",
        street: "5th st",
        city: "Pune",
        state: "MH",
        country: "India",
      },
    } as Request;

    const mockRes = mockResponse();

    const respFromService = {
      id: 1,
      block: "B",
      street: "5th st",
      city: "Pune",
      state: "MH",
      country: "India",
    };

    UserAddressService.addAddressForUser = jest
      .fn()
      .mockResolvedValue(respFromService);

    const response = await AddressHandler.addNewAddress(mockRequest, mockRes);
    expect(mockRes?.status).toHaveBeenCalledWith(StatusCodes.Created);
    expect(mockRes?.json).toHaveBeenCalledTimes(1);
    expect(mockRes?.json).toHaveBeenCalledWith({
      status: "success",
      message: "created",
      data: respFromService,
    });
  });

  it("it should return 200 (getAddressByUser api)", async () => {
    const mockRequest = {
      headers: {},
      body: {},
      params: { userid: 1 },
      user: { id: 1 },
    } as unknown as Request;

    const respFromService = {
      addresses: [
        {
          id: 1,
          block: "B",
          street: "5th st",
          city: "Pune",
          state: "MH",
          country: "India",
        },
      ],
      count: 1,
    };

    UserAddressService.getAddressesByUser = jest
      .fn()
      .mockResolvedValue(respFromService);

    const mockRes = mockResponse();

    const resp = await AddressHandler.getAddressesByUser(mockRequest, mockRes);

    expect(mockRes?.status).toHaveBeenCalledWith(StatusCodes.Success);
    expect(mockRes?.json).toHaveBeenCalledTimes(1);
    expect(mockRes?.json).toHaveBeenCalledWith({
      status: "success",
      message: "ok",
      data: respFromService,
    });
  });

  it("it should return 200 (getAddressById api)", async () => {
    const mockRequest = {
      headers: {},
      body: {},
      params: { id: 1 },
      user: { id: 1 },
    } as unknown as Request;

    const respFromService = {
      id: 1,
      block: "B",
      street: "5th st",
      city: "Pune",
      state: "MH",
      country: "India",
    };

    UserAddressService.getAddressById = jest
      .fn()
      .mockResolvedValue(respFromService);

    const mockRes = mockResponse();

    const resp = await AddressHandler.getAddressById(mockRequest, mockRes);

    expect(mockRes?.status).toHaveBeenCalledWith(StatusCodes.Success);
    expect(mockRes?.json).toHaveBeenCalledTimes(1);
    expect(mockRes?.json).toHaveBeenCalledWith({
      status: "success",
      message: "ok",
      data: { address: respFromService },
    });
  });
});
