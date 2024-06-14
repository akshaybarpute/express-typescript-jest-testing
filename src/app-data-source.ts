import { DataSource } from "typeorm";

export const dSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "managerakshay",
  database: "ecommerce",
  //   entities: ['__dirname + "/../**/*.entity.js'],
  entities: [__dirname + "/../**/*.entity.{js,ts}"],
  logging: true,
  synchronize: true,
  extra: {
    connectionLimit: 5,
  },
});
