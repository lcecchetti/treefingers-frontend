const resolvers = {
  Query: {
    comment: async (root, { id }, { db }) => {
      return await db.models.Comment.findById(id);
    },
  },
  Comment: { }
};

export default resolvers;