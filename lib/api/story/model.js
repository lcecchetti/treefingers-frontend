
import mongoose from 'mongoose';

const StorySchema = new mongoose.Schema({
  title: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
});

export default mongoose.models.Story || mongoose.model('Story', StorySchema);