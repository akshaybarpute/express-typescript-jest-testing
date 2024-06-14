import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Address } from "./address.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
  })
  name: string;

  @Column({
    length: 50,
  })
  email: string;

  @Column({
    length: 255,
  })
  password: string;

  @OneToMany(() => Address, (address) => address.id)
  addresses: Address[];

  constructor(name: string, email: string, password: string);

  constructor(name: string, email: string, password: string, id?: number) {
    this.name = name;
    this.email = email;
    this.password = password;
    if (id) {
      this.id = id;
    }
  }
}
