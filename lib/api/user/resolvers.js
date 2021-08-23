const resolvers = {
  Query: {
    user: (root, { id }, { db }) => {
      return db.models.User.findById(id);
    },
  },
  User: {
    stories: (user, args, { db }) => {
      return db.models.Story.find({ author: user._id });
    },
  }
};

export default resolvers;