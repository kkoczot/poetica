import mongoose from "mongoose";

// 1) All folders all deletable - apart from the first folder which is always called roboczy
// And this property can't be changed
// 2) All folders all by default not shared which means that their poems can't be checked and displayed
// However it can be change but not for the 1st folder called roboczy
const folderSchema = new mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "Author", required: true },
  title: { type: String, required: true },
  description: String,
  deletable: { type: Boolean, default: true }, // ad 1
  shared: { type: Boolean, default: false }, // ad 2
  poems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Poems" }]
});

const Folder = mongoose.models.Folder || mongoose.model("Folder", folderSchema);

export default Folder;