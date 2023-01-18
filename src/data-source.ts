import "reflect-metadata";
import { DataSource } from "typeorm";
import { Dependent } from "./entity/Dependent";
import { Employee } from "./entity/Employee";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: false,
  entities: [Employee, Dependent],
  migrations: [],
  subscribers: [],
});
