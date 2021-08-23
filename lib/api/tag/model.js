 
import mongoose from 'mongoose';

const TagSchema = new mongoose.Schema({
  story: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
  },
  label: {
    type: String, 
    index: true,
  },
  slug: {
    type: String,
    unique: true,
  }
}, {
  timestamps: true,
});

export default mongoose.models.Tag || mongoose.model('Tag', TagSchema);