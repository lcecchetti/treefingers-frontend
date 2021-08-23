import { gql } from 'apollo-server-micro';

export default gql`
  extend type Query {
    user(id: ID!): User
  }  

  type User {
    id: ID!
    email: String!
    stories: [Story]
  }
`;