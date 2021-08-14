import Story from 'lib/mongodb/models/story';

const find = async (filters) => {
  return await Story.find(filters);
};

const findById = async (id) => {
  return await Story.findById(id);
};

export default {
  find,
  findById,
};