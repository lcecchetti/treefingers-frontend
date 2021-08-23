 
import mongoose from 'mongoose';

const LikeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  story: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  },
}, {
  timestamps: true,
});

LikeSchema.index({user: 1, author: 1}, {unique: true});
LikeSchema.index({user: 1, story: 1}, {unique: true});
LikeSchema.index({user: 1, comment: 1}, {unique: true});

export default mongoose.models.Like || mongoose.model('Like', LikeSchema);