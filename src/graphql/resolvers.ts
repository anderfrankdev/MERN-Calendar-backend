import Mutation from "../graphql/mutations.js";
export const resolvers = {
  Record: {
    id: (parent) => parent.id ?? parent._id,
  },
  Query: {
    async record(_, { id }) {
      return "Hola";
    },
    async records(_, __, context) {
      return "Hola";
    },
  },
  Mutation,
};
