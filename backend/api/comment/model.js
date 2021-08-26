 
import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  }, 
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true,
  },
  story: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
    index: true,
  },
  likesCount: {
    type: Number,
    index: true,
    default: 0,
    min: 0,
  },
}, {
  timestamps: true,
});

CommentSchema.post('save', async function(comment) {
  // update counts
  await mongoose.models.Story.updateOne({ _id: comment.story }, { commentsCount: { $inc: 1 } });
});

CommentSchema.post('remove', async function (comment) {
  // update counts
  await mongoose.models.Story.updateOne({ _id: comment.story }, { commentsCount: { $inc: -1 } });

  // clean up
  await mongoose.models.Like.deleteMany({ comment: comment._id });
});

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema);