const resolvers = {
  Query: {
    tag: async (root, { id }, { db }) => {
      return await db.models.Tag.findById(id);
    },
  },
  Tag: { 
    story: async (tag, args, { db }) => {
      return await db.models.Story.findById(tag.story);
    },
  }
};

export default resolvers;