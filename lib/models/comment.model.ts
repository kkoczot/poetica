import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  authorId: { type: mongoose.Types.ObjectId, ref: "Author" },
  poemId: { type: mongoose.Types.ObjectId, ref: "Poem" },
  content: { type: String, required: true },
})

const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema);

export default Comment;