import mongoose from "mongoose";

const notifsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Notifs = mongoose.models.Notifs || mongoose.model("Notifs", notifsSchema);

export default Notifs;