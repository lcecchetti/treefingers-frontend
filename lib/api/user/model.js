 
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  username: {
    type: String,
    unique: true,
  },
  pseudonym: {
    type: String,
    index: true,
  },
  bio: String,
  stories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
    index: true,
  }],
  likesCount: {
    type: Number, 
    index: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.User || mongoose.model('User', UserSchema);