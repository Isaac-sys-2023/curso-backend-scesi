import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    apellidos: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fechaNacimiento: Date,
    descripcion: String,
    imagen: String,
    rol: {
      type: String,
      enum: ["admin", "tutor", "estudiante"],
      default: "estudiante",
    },
    tareasUrl: String,
    tipoEstudiante: { type: String, enum: ["externo", "scesi", "umss"] },
    // redes: [{ nombre: String, img: String, url: String }],
    redes: [
      {
        red: { type: mongoose.Schema.Types.ObjectId, ref: "RedSocial" },
        url: String,
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre(/^find/, function (next) {
  this.populate("redes.red");
  next();
});

export default mongoose.model("User", userSchema);
