import mongoose, { Schema } from 'mongoose';
import moment from 'moment';

const contentSchema = new Schema({
  contentId: String,
  userId: String,
  sex: String,
  age: Number,
  address: String,
  type: String,
  data: Object,
  publishedDate: Date,
});

const Content = mongoose.model('Content', contentSchema);
export default Content;
