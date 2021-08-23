 
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  stories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story'
  }],
});

export default mongoose.models.User || mongoose.model('User', UserSchema);