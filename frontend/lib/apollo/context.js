import dbConnect from 'lib/mongodb/dbConnect';

export const context = async () => {
  return {
    db: await dbConnect(),
  }
};