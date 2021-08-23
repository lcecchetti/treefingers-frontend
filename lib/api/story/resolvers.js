const resolvers = {
  Query: {
    story: async (root, { id }, { db }) => {
      return await db.models.Story.findById(id);
    },
  },
  Story: {
    author: async (story, args, { db }) => {
      return await db.models.User.findById(story.author);
    },
  }
};

export default resolvers;