import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity("addresses")
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
  })
  block: string;

  @Column({
    length: 50,
  })
  street: string;

  @Column({
    length: 50,
  })
  city: string;

  @Column({
    length: 50,
  })
  state: string;

  @Column({
    length: 50,
  })
  country: string;

  // @ManyToOne(() => User, (user) => user.addresses)
  @ManyToOne(() => User, {
    eager: false,
    nullable: false,
  })
  @JoinColumn({ name: "userid" })
  user: User;
}
