import Story from 'lib/mongodb/models/story';

const find = (conditions, projection, options) => {
  return Story.find(conditions, projection, options);
};

const findById = (id) => {
  return Story.findById(id);
};

export default {
  find,
  findById,
};