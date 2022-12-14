import mongoose, { Schema } from 'mongoose';

const contentSchema = new Schema({
  imageUrlPc: String,
  imageUrlMo: String,
  text: String,
  publishedDate: Date,
});

const Content = mongoose.model('Content', contentSchema);
export default Content;
