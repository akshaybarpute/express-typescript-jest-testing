import { Address } from "../entity/address.entity";
import { User } from "../entity/user.entity";
import { dSource } from "../app-data-source";

const userAddressRepository = dSource.getRepository(Address);

export class UserAddressService {
  static async getAddressesByUser(user: User) {
    try {
      //   const addresses = await userAddressRepository.find({
      //     where: {
      //       user: user,
      //     },
      //   });
      const [addresses, count] = await userAddressRepository
        .createQueryBuilder("address")
        .where("address.userid=:userId")
        .orderBy("address.id", "DESC")
        .setParameters({ userId: user.id })
        .getManyAndCount();

      return { addresses: addresses || [], count: count | 0 };
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
        throw err;
      }
    }
  }
  static async addAddressForUser(user: User, address: Address) {
    try {
      address.user = user;
      const add: Address = await userAddressRepository.save(address);
      delete (add as any).user;
      return { address: add };
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
        throw err;
      }
    }
  }
  //todo
  static async getAddressById(id: number, user: User) {
    try {
      const add = await userAddressRepository
        .createQueryBuilder("address")
        .innerJoinAndSelect("address.user", "user")
        .where("address.id=:id")
        .setParameters({ id: id })
        .getOne();

      if (add?.user.id != user.id) {
        throw Error("forbidden");
      }
      delete (add as any).user;
      return add;
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
        throw err;
      }
    }
  }
}
