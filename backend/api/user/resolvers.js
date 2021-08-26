const resolvers = {
  Query: {
    user: async (root, { id }, { db }) => {
      return await db.models.User.findById(id);
    },
  },
  User: {}
};

export default resolvers;