import mongoose from "mongoose";

const folderSchema = new mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "Author", required: true },
  title: { type: String, required: true },
  description: String,
  deletable: { type: Boolean, default: true },
  shared: { type: Boolean, default: false },
  poems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Poems" }]
});

const Folder = mongoose.models.Folder || mongoose.model("Folder", folderSchema);

export default Folder;