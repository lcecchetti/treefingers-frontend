const resolvers = {
  Query: {
    comment: async (root, { id }, { db }) => {
      return await db.models.Like.findById(id);
    },
  },
  Like: { }
};

export default resolvers;