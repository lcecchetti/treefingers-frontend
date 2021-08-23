import { merge } from 'lodash';
import storyResolvers from 'lib/api/story/resolvers';
import userResolvers from 'lib/api/user/resolvers';

export const resolvers = merge( 
  {},
  storyResolvers,
  userResolvers,
);