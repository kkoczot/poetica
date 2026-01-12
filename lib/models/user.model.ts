import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: String,
  bio: String,
  onboarded: {type: Boolean, default: false},
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Author" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "Author" }],
  folders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Folder" }],
  likes: [{type: mongoose.Schema.Types.ObjectId, ref: "Poems"}],
  readNotifs: [{type: mongoose.Schema.Types.ObjectId, ref: "Notifs"}],
});

const Author = mongoose.models.Author || mongoose.model("Author", userSchema);

export default Author;