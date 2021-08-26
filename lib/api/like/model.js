 
import mongoose from 'mongoose';

const LikeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true,
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

LikeSchema.post('save', async function() {
  // update counts
  this.story && await mongoose.models.Story.updateOne({ _id: this.story }, { likesCount: { $inc: 1 } });
  this.author && await mongoose.models.User.updateOne({ _id: this.author }, { likesCount: { $inc: 1 } });
  this.comment && await mongoose.models.comment.updateOne({ _id: this.comment }, { likesCount: { $inc: 1 } });
});

LikeSchema.post('remove', async function(like) {
  // update counts
  like.story && await mongoose.models.Story.updateOne({ _id: like.story }, { likesCount: { $inc: -1 } });
  like.author && await mongoose.models.User.updateOne({ _id: like.author }, { likesCount: { $inc: -1 } });
  like.comment && await mongoose.models.comment.updateOne({ _id: like.comment }, { likesCount: { $inc: -1 } });
});

export default mongoose.models.Like || mongoose.model('Like', LikeSchema);