import { merge } from 'lodash';
import story from 'lib/graphql/story/resolvers';

export const resolvers = merge( 
  {},
  story,
);