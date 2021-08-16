import userController from 'lib/graphql/user/controller';
import storyController from 'lib/graphql/story/controller';

const resolvers = {
  Query: {
    user: (root, { id }) => {
      return userController.findById(id);
    },
  },
  User: {
    stories: (user, { conditions }) => {
      return storyController.find({ author: user._id, ...conditions });
    },
  }
};

export default resolvers;