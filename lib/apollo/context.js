import { dbConnect } from 'lib/mongodb';

export const context = async () => {
  return {
    db: await dbConnect(),
  }
};