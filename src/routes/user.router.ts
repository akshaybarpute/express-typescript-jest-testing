import { Router, Request, Response } from "express";
import { StatusCodes } from "../dtos/StatusCode.dto";
import { User } from "../entity/user.entity";
import { UserService } from "../services/user.service";
import Joi from "joi";

const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const createUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const userRouter: Router = Router();

export class UserHandler {
  static async userLogin(req: Request, res: Response) {
    try {
      await userLoginSchema.validateAsync(req.body);
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
      const resp = await UserService.login(req.body);
      return res.status(StatusCodes.Success).json({
        status: "success",
        message: "Authenticated",
        data: resp,
      });
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.stack);
        if (
          err.message == "invalid credentials" ||
          err.message == "user not found"
        ) {
          return res.status(StatusCodes.UnAuthorized).json({
            status: "success",
            message: "incorrect username or password",
            data: {},
          });
        }
        return res.status(StatusCodes.ServerError).json({
          status: "failed",
          message: "internal server error",
          data: {},
        });
      }
    }
  }

  static async createUser(req: Request, res: Response) {
    try {
      await createUserSchema.validateAsync(req.body);
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
      const user = new User(req.body.name, req.body.email, req.body.password);
      const resp = await UserService.saveUser(user);
      return res.status(StatusCodes.Created).json({
        status: "success",
        message: "created",
        data: resp,
      });
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
      return res.status(StatusCodes.ServerError).json({
        status: "failed",
        message: "internal server error",
        data: {},
      });
    }
  }
}

userRouter.post("/login", UserHandler.userLogin);

userRouter.post("/create", UserHandler.createUser);

// userRouter.post("/addresses", async (req: Request, res: Response) => {
//   try {
//     const addresses: Address[] | void =
//       await UserAddressService.getAddressesByUser(req.user as User);
//     return res.status(StatusCodes.Success).json({
//       status: "success",
//       message: "ok",
//       data: addresses,
//     });
//   } catch (err) {
//     if (err instanceof Error) {
//       console.log(err.message);

//       return res.status(StatusCodes.ServerError).json({
//         status: "failed",
//         message: err.message,
//       });
//     }
//   }
// });
