import storyController from 'lib/api/story/controller';
import userController from 'lib/api/user/controller';

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