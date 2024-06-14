import { Router, Request, Response } from "express";
import { StatusCodes } from "../dtos/StatusCode.dto";
import { Address } from "../entity/address.entity";
import { UserAddressService } from "../services/user.address.service";
import Joi from "joi";

const createAddressSchema = Joi.object({
  block: Joi.string().required(),
  street: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  country: Joi.string().required(),
  //   userId: Joi.string().required(),
});

export const addressRouter = Router();

addressRouter.get("/user/:userid", async (req: Request, res: Response) => {
  try {
    if ((req.params.userid as unknown as number) != req.user.id) {
      throw Error("Forbidden");
    }
    const add = await UserAddressService.getAddressesByUser(req.user);
    return res.status(StatusCodes.Success).json({
      status: "success",
      message: "ok",
      data: { addresses: add?.addresses, count: add?.count },
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
      if (err.message == "Forbidden") {
        return res.status(StatusCodes.Forbidden).json({
          status: "success",
          message: err.message,
        });
      }
      return res.status(StatusCodes.ServerError).json({
        status: "success",
        message: err.message,
        data: {},
      });
    }
  }
});

addressRouter.post("/create", async (req: Request, res: Response) => {
  const addressRequest = req.body;
  //   addressRequest.userid = req.user.id;
  try {
    await createAddressSchema.validateAsync(addressRequest);
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    }
    return res.status(StatusCodes.BadRequest).json({
      status: "success",
      message: "MalformedRequest",
      data: {},
    });
  }

  try {
    const add = await UserAddressService.addAddressForUser(
      req.user,
      addressRequest
    );
    return res.status(StatusCodes.Created).json({
      status: "success",
      message: "created",
      data: add,
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
      return res.status(StatusCodes.ServerError).json({
        status: "failed",
        message: err.message,
        data: {},
      });
    }
  }
});

addressRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(StatusCodes.BadRequest).json({
        status: "success",
        message: "MalformedRequest",
        data: {},
      });
    }

    const add = await UserAddressService.getAddressById(
      req.params.id as unknown as number,
      req.user
    );
    return res.status(StatusCodes.Success).json({
      status: "success",
      message: "ok",
      data: {
        address: add,
      },
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
      let statusCode = StatusCodes.ServerError;
      if (err.message == "forbidden") {
        statusCode = StatusCodes.Forbidden;
      }
      return res.status(statusCode).json({
        status: "failed",
        message: err.message,
        data: {},
      });
    }
  }
});
