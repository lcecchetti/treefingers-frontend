import { dbConnect } from 'backend/lib/mongodb';

export const context = async () => {
  return {
    db: await dbConnect(),
  }
};