import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: String,
  bio: String,
  onboarded: {type: Boolean, default: false},
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Author" }], // user is followed by other users
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "Author" }], // user is following other users
  folders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Folder" }], // user has folders
  likes: [{type: mongoose.Schema.Types.ObjectId, ref: "Poems"}], // user likes poems
});

const Author = mongoose.models.Author || mongoose.model("Author", userSchema);

export default Author;