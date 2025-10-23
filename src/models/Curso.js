import mongoose from "mongoose";
const cursoSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    fechaInicio: { type: Date, required: true },
    fechaFin: { type: Date, required: true },
    duracionEnSemanas: { type: Number, required: true },
    precioGeneral: { type: Number, required: true },
    precioUMSS: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Por Iniciar", "En Progreso", "Finalizado"],
      default: "Por Iniciar",
      required: true,
    },
    estaCancelado: { type: Boolean, default: false },
    imgCurso: String,
    aficheImg: String,
    techs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tech", required: true }],
    tutores: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    estudiantes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    horarios: [{ type: mongoose.Schema.Types.ObjectId, ref: "Horario", required: true }],
  },
  { timestamps: true }
);
export default mongoose.model("Curso", cursoSchema);
