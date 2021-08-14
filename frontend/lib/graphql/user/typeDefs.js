import { gql } from 'apollo-server-micro';

const typeDefs = gql`
  extend type Query {
    user(id: ID!): User
  }  

  type User {
    id: ID!
    email: String!
    stories: [Story]
  }
`;

export default typeDefs;