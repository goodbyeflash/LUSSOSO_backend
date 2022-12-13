import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  name: String,
  hp: String,
  branch: String,
  publishedDate: Date,
});

const User = mongoose.model('User', userSchema);
export default User;
