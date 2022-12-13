import mongoose, { Schema } from 'mongoose';

const contentSchema = new Schema({
  imageUrl: String,
  text: String,
  publishedDate: Date,
});

const Content = mongoose.model('Content', contentSchema);
export default Content;
