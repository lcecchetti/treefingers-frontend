import storyController from 'lib/graphql/story/controller';
import userController from 'lib/graphql/user/controller';

const resolvers = {
  Query: {
    story: (root, { id }) => {
      return storyController.findById(id);
    },
  },
  Story: {
    author: (story) => {
      return userController.findById(story.author);
    },
  }
};

export default resolvers;