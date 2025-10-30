import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const register = async (req, res) => {
  try {
    const {
      nombre,
      apellidos,
      email,
      password,
      rol,
      fechaNacimiento,
      ...rest
    } = req.body;

    if (!email || !password || !nombre || !apellidos || !fechaNacimiento)
      return res.status(400).json({ msg: "Campos básicos requeridos" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "Usuario ya existe" });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // URL de Cloudinary si se subió imagen
    const imagenUrl = req.file?.path || "";

    const fechaParseada = new Date(fechaNacimiento);

    let redes = [];
    if (rest.redes) {
      try {
        redes = JSON.parse(req.body.redes);
      } catch (err) {
        console.error("Error al parsear redes:", err);
      }
    }
    
    const userData = {
      nombre,
      apellidos,
      email,
      password: hash,
      rol,
      // fechaNacimiento,
      fechaNacimiento: fechaParseada,
      imagen: imagenUrl,
    };

    // ---- VALIDACIÓN POR ROL ----
    if (rol === "admin") {
      // nada extra
    }

    if (rol === "tutor") {
      if (!rest.redes || rest.redes.length === 0)
        return res
          .status(400)
          .json({ msg: "Las redes son requeridas para tutores" });

      userData.descripcion = rest.descripcion || "";
      userData.redes = redes;
    }

    if (rol === "estudiante") {
      if (!rest.tipoEstudiante)
        return res
          .status(400)
          .json({ msg: "tipoEstudiante es requerido para estudiantes" });

      userData.tipoEstudiante = rest.tipoEstudiante;
      userData.tareasUrl = rest.tareasUrl || "";
      if (rest.redes && rest.redes.length > 0) userData.redes = rest.redes;
    }

    const user = new User(userData);
    await user.save();

    res.status(201).json({
      msg: "Usuario creado",
      id: user._id,
      rol: user.rol,
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Credenciales inválidas" });

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) return res.status(400).json({ msg: "Credenciales inválidas" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // res.json({ token });
    res.json({
      token,
      nombre: user.nombre,
      email: user.email,
      role: user.rol,
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });
    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) return res.status(400).json({ msg: "Password actual incorrecto" });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.json({ msg: "Password actualizado" });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};
