 
import mongoose from 'mongoose';
import slugify from 'slugify';

const TagSchema = new mongoose.Schema({
  label: {
    type: String, 
    index: true,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
    required: true,
  },
  //@todo keep track of story count
  storiesCount: {
    type: Number, 
    index: true,
    default: 0,
    min: 0,
  },
}, {
  timestamps: true,
});

TagSchema.pre('save', async function() {
  this.slug = slugify(this.label);
});

export default mongoose.models.Tag || mongoose.model('Tag', TagSchema);