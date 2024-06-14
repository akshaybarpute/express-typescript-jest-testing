import express, { Application, Request, Response } from "express";
import { userRouter } from "./routes/user.router";
import { addressRouter } from "./routes/address.router";
import helmet from "helmet";
import cors from "cors";
import { dSource } from "./app-data-source";
import { authMiddleware } from "./helpers/auth.helper";
import { User } from "./entity/user.entity";

dSource
  .initialize()
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

declare global {
  interface Error {
    name: string;
    message: string;
    stack?: string;
    code?: number | string;
  }
}

const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authMiddleware);

app.use("/users", userRouter);
app.use("/addresses", addressRouter);

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    status: "success",
    message: "hello world",
  });
});

app.listen(3000, () => {
  console.log("server is listening on 3000");
});
