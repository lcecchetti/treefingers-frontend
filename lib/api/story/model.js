
import mongoose from 'mongoose';

const StorySchema = new mongoose.Schema({
  title: {
    type: String, 
    index: true,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  action: String,
  root: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
    index: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
    index: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true,
  },
  likesCount: {
    type: Number,
    index: true,
  },
  commentsCount: {
    type: Number, 
    index: true,
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag',
    index: true,
  }],
}, {
  timestamps: true,
});

export default mongoose.models.Story || mongoose.model('Story', StorySchema);