import { ApolloServer } from 'apollo-server-micro';
import { typeDefs } from 'lib/apollo/type-defs';
import { resolvers } from 'lib/apollo/resolvers';
import { context } from 'lib/apollo/context';

const apolloServer = new ApolloServer({ typeDefs, resolvers, context });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: '/api/graphql' });