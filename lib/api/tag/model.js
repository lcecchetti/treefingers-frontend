 
import mongoose from 'mongoose';

const TagSchema = new mongoose.Schema({
  story: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
    required: true,
  },
  label: {
    type: String, 
    index: true,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
    required: true,
  }
}, {
  timestamps: true,
});

export default mongoose.models.Tag || mongoose.model('Tag', TagSchema);