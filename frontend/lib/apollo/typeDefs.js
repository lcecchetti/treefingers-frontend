import { gql } from 'apollo-server-micro';
import Story from 'lib/graphql/story/typeDefs';

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
];