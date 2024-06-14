import { User } from "../entity/user.entity";
import { dSource } from "../app-data-source";
import {
  comparePasswords,
  generateToken,
  hashPassword,
} from "../helpers/auth.helper";

const UserRepository = dSource.getRepository(User);

export class UserService {
  static async saveUser(user: User) {
    try {
      const password = await hashPassword(user.password);
      user.password = <string>password;
      await UserRepository.save(user);
      user.password = "";
      const token = await generateToken(user);
      return { token, user };
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
        throw err;
      }
    }
  }
  static async login(user: User): Promise<unknown> {
    try {
      const dbUser = await UserRepository.findOneBy({
        email: user.email,
      });
      const dbPassword = dbUser?.password;
      if (!dbPassword) {
        throw Error("user not found");
      }
      const result = await comparePasswords(user.password, dbUser.password);
      if (!result) {
        throw Error("invalid credentials");
      }
      const token = await generateToken(dbUser);
      dbUser.password = "";
      return { token, user: dbUser };
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
        throw err;
      }
    }
  }
}
