import { merge } from 'lodash';
import { GraphQLDateTime } from 'graphql-iso-date';
import storyResolvers from 'lib/api/story/resolvers';
import userResolvers from 'lib/api/user/resolvers';

const baseResolvers = {
  Date: GraphQLDateTime,
};

export const resolvers = merge( 
  baseResolvers,
  storyResolvers,
  userResolvers,
);