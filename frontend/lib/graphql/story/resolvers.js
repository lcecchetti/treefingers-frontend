import storyController from 'lib/graphql/story/controller';
import userController from 'lib/graphql/user/controller';

const resolvers = {
  Query: {
    story: async (parent, { id }, context) => {
      return await storyController.findById(id);
    },
  },
  Story: {
    author: async (parent, args, context) => {
      return await userController.findById(parent.author);
    },
  }
};

export default resolvers;