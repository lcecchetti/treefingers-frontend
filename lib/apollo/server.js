import { ApolloServer } from 'apollo-server-micro';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';
import { context } from './context';

const createApolloServer = () => new ApolloServer({ typeDefs, resolvers, context });

export {
  createApolloServer,
};