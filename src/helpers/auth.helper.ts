import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../entity/user.entity";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "../dtos/StatusCode.dto";
const saltRounds = 10;
const secret = "shhhhh";

// declare module "express-serve-static-core" {
//   interface Request {
//     user?: object;
//   }
// }
export const hashPassword = function (
  password: string
): Promise<string | unknown> {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) {
        return reject(err);
      }
      return resolve(hash);
    });
  });
};

export const comparePasswords = function (password: string, hash: string) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, function (err, result) {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};

export const generateToken = async function (data: User) {
  return jwt.sign(
    {
      id: data.id,
      name: data.name,
      email: data.email,
    },
    secret,
    { expiresIn: "1h" }
  );
};

export const decodeToken = async function (token: string) {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
      throw err;
    }
  }
};

export const authMiddleware = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const excludesPaths = ["/users/login", "/users/create"];
  console.log(req.path);
  if (excludesPaths.includes(req.path)) {
    next();
  } else {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        throw Error("Authorization header missing");
      }
      // console.log("token: ", token);
      const user = await decodeToken(token);

      delete (user as any).iat;
      delete (user as any).exp;
      // console.log("user: ", user);
      req["user"] = user as User;
      next();
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
        return res.status(StatusCodes.UnAuthorized).json({
          status: "unAuthorized",
          message: err.message,
        });
      }
    }
  }
};
