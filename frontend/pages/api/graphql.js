import { createApolloServer } from 'lib/apollo/server';

const apolloServer = createApolloServer();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: '/api/graphql' });