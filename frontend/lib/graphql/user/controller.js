import User from 'lib/mongodb/models/user';

const findById = (id) => {
  return User.findById(id);
};

export default {
  findById,
};