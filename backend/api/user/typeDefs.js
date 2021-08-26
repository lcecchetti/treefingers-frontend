import { gql } from 'apollo-server-micro';

export default gql`
  extend type Query {
    user(id: ID!): User
  }  

  type User {
    id: ID!
    email: String!
    username: String!
    pseudonym: String!
    bio: String
    likesCount: Int!
    storiesCount: Int!    
    createdAt: Date!
    updatedAt: Date!
  }
`;