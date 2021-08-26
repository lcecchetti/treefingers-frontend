
import mongoose from 'mongoose';
import paginationService from 'backend/api/pagination/service';

const StorySchema = new mongoose.Schema({
  title: {
    type: String, 
    index: true,
    required: true,
    maxLength: 255,
    minLength: 1,
  },
  content: {
    type: String,
    required: true,
    maxLength: 1000,
    minLength: 1,
  },
  action: {
    type: String,
    minLength: 1,
    maxLength: 255,
  },
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
    default: 0,
    min: 0,
  },
  commentsCount: {
    type: Number, 
    index: true,
    default: 0,
    min: 0,
  },
  childrenCount: {
    type: Number, 
    index: true,
    default: 0,
    min: 0,
  },
  descendentsCount: {
    type: Number, 
    index: true,
    default: 0,
    min: 0,
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag',
    index: true,
  }],
}, {
  timestamps: true,
});

StorySchema.post('save', async function() {
  // update counts
  await mongoose.models.User.updateOne({ _id: this.author }, { storiesCount: { $inc: 1 } });
  this.root && await mongoose.models.Story.updateOne({ _id: this.root }, { descendentsCount: { $inc: 1 } });
  this.parent && await mongoose.models.Story.updateOne({ _id: this.parent }, { childrenCount: { $inc: 1 } });
});

StorySchema.post('remove', async function(story) {
  // update counts
  await mongoose.models.User.updateOne({ _id: story.author }, { storiesCount: { $inc: -1 } });
  story.root && await mongoose.models.Story.updateOne({ _id: story.root }, { descendentsCount: { $inc: -1 } });
  story.parent && await mongoose.models.Story.updateOne({ _id: story.parent }, { childrenCount: { $inc: -1 } });

  // clean up
  // delete comments forwarding likes deletion responsibility
  const comments = await mongoose.models.Comment.find({ story: story._id });
  comments.map((comment) => {
    comment.remove();
  });

  // delete likes
  await mongoose.models.Like.deleteMany({ story: story._id });
  
  // recursively delete child stories
  const children = await mongoose.models.Story.find({ parent: story._id });
  children.map((childStory) => {
    childStory.remove();
  });
});

StorySchema.statics.paginate = async function (filter, sort, pagination) {
  return await paginationService.paginate(this, filter, sort, { limit: 10, ...pagination});
};

export default mongoose.models.Story || mongoose.model('Story', StorySchema);