import Story from 'lib/api/story/model';

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