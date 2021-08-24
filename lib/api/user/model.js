 
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  pseudonym: {
    type: String,
    index: true,
    required: true,
  },
  bio: String,
  likesCount: {
    type: Number, 
    index: true,
  },
  storiesCount: {
    type: Number, 
    index: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.User || mongoose.model('User', UserSchema);