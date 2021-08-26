import { gql } from 'apollo-server-micro';

export default gql`
  extend type Query {
    story(id: ID!): Story
    stories(filter: String, sort: String, pagination: PaginationInput): StoryConnection!
  }  

  extend type Mutation {
    createStory(input: CreateStoryInput!): CreateStoryPayload!
  }  

  input CreateStoryDataInput {
    title: String!
    content: String!
    action: String
    author: ID!
    root: ID
    parent: ID
    tags: [ID]
  }

  input CreateStoryInput {
    data: CreateStoryDataInput
  }

  type CreateStoryPayload {
    story: Story!
  }

  type StoryEdge implements Edge {
    cursor: String
    node: Story! 
  }

  type StoryConnection implements Connection {
    edges: [StoryEdge!]!
    pageInfo: PageInfo!
  }

  type Story implements Node {
    id: ID!
    title: String!
    content: String!
    action: String
    excerpt: String!
    author: User!
    root: Story
    parent: Story
    likesCount: Int!
    commentsCount: Int!
    tags: [Tag]
    createdAt: Date!
    updatedAt: Date!
  }
`;