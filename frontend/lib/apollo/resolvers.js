import { merge } from 'lodash';
import story from 'lib/api/story/resolvers';
import user from 'lib/api/user/resolvers';

export const resolvers = merge( 
  {},
  story,
  user,
);