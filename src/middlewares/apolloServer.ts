import { ApolloServer } from "@apollo/server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { resolvers } from "../graphql/resolvers.js";
import { expressMiddleware } from "@apollo/server/express4";
import gql from "graphql-tag";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const g = readFileSync(
  __dirname.replace("dist/middlewares", "src/graphql/schema.graphql"),
  "utf-8",
);

const typeDefs = gql(g);

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});
// Note you must call `start()` on the `ApolloServer`
// instance before passing the instance to `expressMiddleware`
await server.start();
//highlight-end

export default expressMiddleware(server);
