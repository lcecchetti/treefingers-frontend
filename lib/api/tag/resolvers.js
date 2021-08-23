const resolvers = {
  Query: {
    tag: async (root, { id }, { db }) => {
      return await db.models.Tag.findById(id);
    },
  },
  Tag: { }
};

export default resolvers;