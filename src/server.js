import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import cursoRoutes from "./routes/cursos.js";
import techRoutes from "./routes/techs.js";
import horarioRoutes from "./routes/horarios.js";
import redSocialRoutes from "./routes/redesSociales.js";

import { swaggerUi, swaggerSpec } from "./config/swagger.js";

dotenv.config();
const app = express();
app.use(
  cors({
    origin: "*", // permite cualquier origen (solo para pruebas)
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());

connectDB();

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => res.send("API funcionando 😎"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cursos", cursoRoutes);
app.use("/api/techs", techRoutes);
app.use("/api/cursos", horarioRoutes);
app.use("/api/redes", redSocialRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📘 Swagger disponible en: http://localhost:${PORT}/api/docs`);
});
