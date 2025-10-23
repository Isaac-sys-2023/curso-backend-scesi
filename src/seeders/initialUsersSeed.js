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
    // 🗑️ Limpiar datos
    await User.deleteMany({});
    await RedSocial.deleteMany({});
    console.log("🗑️ Usuarios y redes sociales eliminados");

    // ✅ Crear redes sociales y guardar referencias
    const nombresRedes = [
      "facebook",
      "github",
      "linkedin",
      "instagram",
      "tik-tok",
      "twitter",
      "youtube",
    ];

    const redesCreadas = [];

    for (const nombre of nombresRedes) {
      let red = await RedSocial.findOne({ nombre });
      if (!red) {
        red = new RedSocial({
          nombre,
          img: `../redes-sociales/${nombre}.png`,
        });
        await red.save();
        console.log(`✅ Red social ${nombre} creada`);
      } else {
        console.log(`⚠️ Red social ${nombre} ya existe`);
      }
      redesCreadas.push(red);
    }

    // ✅ Obtener el id de GitHub
    const githubRed = redesCreadas.find((r) => r.nombre === "github");
    if (!githubRed) throw new Error("No se encontró la red de GitHub 😱");

    // ✅ Crear admin
    const adminExist = await User.findOne({ rol: "admin" });
    if (!adminExist) {
      const hashedPassword = await bcrypt.hash("Admin123!", 10);
      const admin = new User({
        nombre: "Admin",
        apellidos: "Inicial",
        email: "admin@tuapp.com",
        password: hashedPassword,
        fechaNacimiento: new Date("2000-03-21"),
        rol: "admin",
      });
      await admin.save();
      console.log("✅ Admin creado: admin@tuapp.com / Admin123!");
    } else {
      console.log("⚠️ Admin ya existe");
    }

    // ✅ Crear tutor de prueba con referencia real a GitHub
    const tutorExist = await User.findOne({ email: "huarachigutierrezisaac@gmail.com" });
    if (!tutorExist) {
      const hashedPassword = await bcrypt.hash("Tutor123!", 10);
      const tutor = new User({
        nombre: "Isaac",
        apellidos: "Gutierrez",
        email: "huarachigutierrezisaac@gmail.com",
        password: hashedPassword,
        rol: "tutor",
        descripcion: "Tutor de prueba creado en el seed",
        fechaNacimiento: new Date("1998-06-15"),
        redes: [
          { red: githubRed._id, url: "https://github.com/Isaac-sys-2023" }, // ✅ usa el ID real
        ],
      });
      await tutor.save();
      console.log("✅ Tutor creado: huarachigutierrezisaac@gmail.com / Tutor123!");
    } else {
      console.log("⚠️ Tutor ya existe");
    }

    // ✅ Crear estudiante de prueba
    const userExist = await User.findOne({ email: "user@tuapp.com" });
    if (!userExist) {
      const hashedPassword = await bcrypt.hash("User123!", 10);
      const user = new User({
        nombre: "Usuario",
        apellidos: "Test",
        email: "user@tuapp.com",
        password: hashedPassword,
        fechaNacimiento: new Date("2005-05-15"),
        rol: "estudiante",
        tipoEstudiante: "scesi",
      });
      await user.save();
      console.log("✅ Estudiante creado: user@tuapp.com / User123!");
    } else {
      console.log("⚠️ Estudiante ya existe");
    }

    console.log("🎉 Seed completado correctamente!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error en seed:", err);
    process.exit(1);
  }
};

seedUsers();
