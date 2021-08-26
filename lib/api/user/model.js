 
import mongoose from 'mongoose';
import slugify from 'slugify';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    trim: true,
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
    trim: true,
  },
  bio: {
    type: String,
    maxLength: 1000,
  },
  likesCount: {
    type: Number, 
    index: true,
    default: 0,
    min: 0,
  },
  storiesCount: {
    type: Number, 
    index: true,
    default: 0,
    min: 0,
  },
}, {
  timestamps: true,
});

UserSchema.pre('save', function() {
  this.username = slugify(this.pseudonym);
});

export default mongoose.models.User || mongoose.model('User', UserSchema);