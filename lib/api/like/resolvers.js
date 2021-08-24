const resolvers = {
  Query: {
    like: async (root, { id }, { db }) => {
      return await db.models.Like.findById(id);
    },
  },
  Like: { 
    user: async (like, args, { db }) => {
      return await db.models.User.findById(like.user);
    },
    story: async (like, args, { db }) => {
      return await db.models.Story.findById(like.story);
    },
    comment: async (like, args, { db }) => {
      return await db.models.Story.findById(like.comment);
    },
    author: async (like, args, { db }) => {
      return await db.models.User.findById(like.author);
    },
  }
};

export default resolvers;