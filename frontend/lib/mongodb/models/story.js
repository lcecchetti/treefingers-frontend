 
import mongoose from 'mongoose';

const StorySchema = new mongoose.Schema({
  title: String,
});

export default mongoose.models.Story || mongoose.model('Story', StorySchema);