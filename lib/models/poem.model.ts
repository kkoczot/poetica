import mongoose from "mongoose";

const poemSchema = new mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "Author", required: true },
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", required: true },
  title: { type: String, required: true },
  type: { type: String, required: true },
  content: { type: String, required: true },
  favourite: [{ type: mongoose.Schema.Types.ObjectId, ref: "Author" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  tags: [{ type: String }],
});

const Poem = mongoose.models.Poem || mongoose.model("Poem", poemSchema);

export default Poem;