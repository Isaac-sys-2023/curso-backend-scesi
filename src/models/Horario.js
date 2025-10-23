import mongoose from "mongoose";
const horarioSchema = new mongoose.Schema(
  {
    dia: {
      type: String,
      enum: [
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
        "Domingo",
      ],
      required: true,
    },
    horaInicio: {
      type: String,
      required: true,
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato HH:mm inválido"],
    },
    horaFin: {
      type: String,
      required: true,
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato HH:mm inválido"],
    },
    modalidad: {
      type: String,
      enum: ["virtual", "presencial", "híbrido"],
      default: "virtual",
    },
    curso: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Curso",
      required: true,
    },
  },
  { timestamps: true }
);
export default mongoose.model("Horario", horarioSchema);
