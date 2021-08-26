import { cursor } from "tailwindcss/defaultTheme";

const resolvers = {
  Query: {
    comment: async (root, { id }, { db }) => {
      return await db.models.Comment.findById(id);
    },
    createComment: async (root, { input }, { db }) => {
      return await db.models.Comment.create(input.data);
    },
  },
  Comment: { 
    user: async (comment, args, { db }) => {
      return await db.models.User.findById(comment.user);
    },
    story: async (comment, args, { db }) => {
      return await db.models.Story.findById(comment.story);
    },
  }
};

export default resolvers;