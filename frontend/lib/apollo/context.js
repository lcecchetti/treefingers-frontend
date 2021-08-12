import dbConnect from 'lib/mongodb/connection';

export const context = async () => {
  return {
    db: await dbConnect(),
  }
};