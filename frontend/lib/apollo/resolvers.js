import Story from 'lib/mongodb/models/story';

export const resolvers = {
  Query: {
    test: async (_parent, _args, _context, _info) => {
      try {
        const story = await Story.findOne();
        return story.title;
      }
      catch(e) {
        console.log(e);
      }
    },
  },
};