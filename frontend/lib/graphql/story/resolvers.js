import storyController from './controller';

const resolvers = {
  Query: {
    story: async (parent, { id }, context) => {
      return await storyController.findOne(id);
    },
  },
  Story: {}
};

export default resolvers;