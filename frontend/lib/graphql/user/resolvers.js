import userController from 'lib/graphql/user/controller';
import storyController from 'lib/graphql/story/controller';

const resolvers = {
  Query: {
    user: async (parent, { id }, context) => {
      return await userController.findById(id);
    },
  },
  User: {
    stories: async (parent, args, context) => {
      return await storyController.find({ _id: parent.stories });
    },
  }
};

export default resolvers;