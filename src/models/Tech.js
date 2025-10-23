import mongoose from "mongoose";
const techSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    version: { type: String, required: true },
    imgUrl: String,
  },
  { timestamps: true }
);
techSchema.index({ nombre: 1, version: 1 }, { unique: true });
export default mongoose.model("Tech", techSchema);
