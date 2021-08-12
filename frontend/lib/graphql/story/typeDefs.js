import { gql } from 'apollo-server-micro';

const typeDefs = gql`
  extend type Query {
    story(id: ID!): Story
  }  

  type Story {
    title: String
  }
`;

export default typeDefs;