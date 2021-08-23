const resolvers = {
  Query: {
    user: async (root, { id }, { db }) => {
      return await db.models.User.findById(id);
    },
  },
  User: {
    stories: async (user, args, { db }) => {
      return await db.models.Story.find({ author: user._id });
    },
  }
};

export default resolvers;