import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server";
import { AppDataSource } from "./data-source";
import { EmployeeResolver } from "./graphql/resolvers/EmployeeResolver";

AppDataSource.initialize()
  .then(async () => {
    const schema = await buildSchema({ resolvers: [EmployeeResolver] });
    const server = new ApolloServer({ schema });
    await server.listen(4000);
    console.log("Server has started!");
  })
  .catch((error) => console.log(error));
