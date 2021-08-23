import { gql } from 'apollo-server-micro';

const typeDefs = gql`
  extend type Query {
    like(id: ID!): Like
  }  

  type Like {
    id: ID!
  }
`;

export default typeDefs;