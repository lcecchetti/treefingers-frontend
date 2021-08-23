import { gql } from 'apollo-server-micro';
import Story from 'lib/api/story/typeDefs';
import User from 'lib/api/user/typeDefs';

const Query = gql`
  type Query {
    _empty: String
  }
`;

const Mutation = gql`
  type Mutation {
    _empty: String
  }
`;

export const typeDefs = [
  Query,
  Mutation,
  Story,
  User,
];