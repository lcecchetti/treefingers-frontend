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
    root: async (story, args, { db }) => {
      return await db.models.Story.findById(story.root);
    },
    parent: async (story, args, { db }) => {
      return await db.models.Story.findById(story.parent);
    },
    tags: async (story, args, { db }) => {
      return await db.models.User.find({ id: { $in: story.tags } });
    },
  }
};

export default resolvers;