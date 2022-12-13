import mongoose, { Schema } from 'mongoose';
import moment from 'moment';

const userSchema = new Schema({
  name: String,
  sex: String,
  age: Number,
  address: String,
  schoolName: String,
  schoolCode: String,
  type: String,
  grade: String,
  ip: String,
  publishedDate: Date,
  user: {
    _id: mongoose.Types.ObjectId,
  },
});

const User = mongoose.model('User', userSchema);
export default User;
