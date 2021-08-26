import { gql } from 'apollo-server-micro';
import paginationTypeDefs from 'lib/api/pagination/typeDefs';
import storyTypeDefs from 'lib/api/story/typeDefs';
import userTypeDefs from 'lib/api/user/typeDefs';
import commentTypeDefs from 'lib/api/comment/typeDefs';
import likeTypeDefs from 'lib/api/like/typeDefs';
import tagTypeDefs from 'lib/api/tag/typeDefs';

const customScalarsTypeDefs = gql`
  scalar Date
`;

const baseOperationsTypeDefs = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
`;

export const typeDefs = [
  customScalarsTypeDefs,
  baseOperationsTypeDefs,
  paginationTypeDefs,
  storyTypeDefs,
  userTypeDefs,
  commentTypeDefs,
  likeTypeDefs,
  tagTypeDefs,
];