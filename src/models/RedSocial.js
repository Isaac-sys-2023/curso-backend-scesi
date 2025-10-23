import mongoose from "mongoose";

const redSocialSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre de la red es obligatorio"],
      unique: true,
      trim: true,
    },
    img: {
      type: String,
      required: [true, "La imagen es obligatoria"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("RedSocial", redSocialSchema);
