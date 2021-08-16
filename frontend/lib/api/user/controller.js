import User from 'lib/api/user/model';

const findById = (id) => {
  return User.findById(id);
};

export default {
  findById,
};