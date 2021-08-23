 
import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  content: String, 
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
  story: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
    index: true,
  },
  likesCount: {
    type: Number,
    index: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema);