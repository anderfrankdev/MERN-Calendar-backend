import Mutation from "../graphql/mutations.js";
import Query from "../graphql/query.js";
export const resolvers = {
  Record: {
    id: (parent) => parent.id ?? parent._id,
  },
  Query,
  Mutation,
};
