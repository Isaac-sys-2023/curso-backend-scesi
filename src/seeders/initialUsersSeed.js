import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";
import RedSocial from "../models/RedSocial.js";

dotenv.config();

// ✅ Conexión
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conectado a MongoDB para el seed"))
  .catch((err) => {
    console.error("Error conectando a MongoDB:", err);
    process.exit(1);
  });

const seedUsers = async () => {
  try {
    await User.deleteMany({});
    console.log("🗑️ Usuarios eliminados");
    
    // ✅ Admin
    const hashedAdmin = await bcrypt.hash("Admin123!", 10);
    const admin = new User({
      nombre: "Admin",
      apellidos: "Inicial",
      email: "admin@tuapp.com",
      password: hashedAdmin,
      fechaNacimiento: new Date("2000-03-21"),
      rol: "admin",
    });
    await admin.save();
    console.log("✅ Admin creado: admin@tuapp.com / Admin123!");
    // ✅ Estudiante
    const hashedUser = await bcrypt.hash("User123!", 10);
    const user = new User({
      nombre: "Usuario",
      apellidos: "Test",
      email: "user@tuapp.com",
      password: hashedUser,
      fechaNacimiento: new Date("2005-05-15"),
      rol: "estudiante",
      tipoEstudiante: "scesi",
    });
    await user.save();
    console.log("✅ Estudiante creado: user@tuapp.com / User123!");

    console.log("🎉 Seed completado correctamente!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error en seed:", err);
    process.exit(1);
  }
};

seedUsers();