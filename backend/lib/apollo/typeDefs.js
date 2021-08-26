import { gql } from 'apollo-server-micro';
import paginationTypeDefs from 'backend/api/pagination/typeDefs';
import storyTypeDefs from 'backend/api/story/typeDefs';
import userTypeDefs from 'backend/api/user/typeDefs';
import commentTypeDefs from 'backend/api/comment/typeDefs';
import likeTypeDefs from 'backend/api/like/typeDefs';
import tagTypeDefs from 'backend/api/tag/typeDefs';

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