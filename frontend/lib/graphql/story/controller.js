import Story from 'lib/mongodb/models/story';

const find = () => {

};

const findOne = async (id) => {
  return await Story.findOne({ _id: id });
};

export default {
  find,
  findOne
};