import { gql } from 'apollo-server-micro';
import storyTypeDefs from 'lib/api/story/typeDefs';
import userTypeDefs from 'lib/api/user/typeDefs';
import commentTypeDefs from 'lib/api/comment/typeDefs';
import likeTypeDefs from 'lib/api/like/typeDefs';
import tagTypeDefs from 'lib/api/tag/typeDefs';

const baseTypeDefs = gql`
  scalar Date

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
`;

export const typeDefs = [
  baseTypeDefs,
  storyTypeDefs,
  userTypeDefs,
  commentTypeDefs,
  likeTypeDefs,
  tagTypeDefs,
];