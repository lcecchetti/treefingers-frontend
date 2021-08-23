import { gql } from 'apollo-server-micro';

const typeDefs = gql`
  extend type Query {
    comment(id: ID!): Comment
  }  

  type Comment {
    id: ID!
  }
`;

export default typeDefs;