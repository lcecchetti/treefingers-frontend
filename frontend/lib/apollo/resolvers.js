import { merge } from 'lodash';
import story from 'lib/graphql/story/resolvers';
import user from 'lib/graphql/user/resolvers';

export const resolvers = merge( 
  {},
  story,
  user,
);