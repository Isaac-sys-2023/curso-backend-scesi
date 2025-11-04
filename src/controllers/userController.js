import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

export const listUsers = async (req, res) => {
  const users = await User.find().select("-password").lean();

  const filtered = users.map(user => {
    if (user.rol === "admin") {
      delete user.redes;
      delete user.tareasUrl;
      delete user.tipoEstudiante;
      delete user.descripcion;
      if (!user.imagen) delete user.imagen;
    } else if (user.rol === "tutor") {
      delete user.tareasUrl;
      delete user.tipoEstudiante;
      if (!user.imagen) delete user.imagen;
      if (!user.descripcion) delete user.descripcion;
    } else if (user.rol === "estudiante") {
      delete user.descripcion;
      if (!user.redes) delete user.redes;
      if (!user.imagen) delete user.imagen;
      if (!user.tareasUrl) delete user.tareasUrl;
    }
    return user;
  });

  res.json(filtered);
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const requester = req.user;

    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    // Solo admin o el mismo usuario puede ver
    if (requester.rol !== "admin" && requester._id.toString() !== id)
      return res.status(403).json({ msg: "Acceso denegado" });

    const data = user.toObject();

    // Filtrar campos según rol
    if (data.rol === "admin") {
      delete data.redes;
      delete data.tareasUrl;
      delete data.tipoEstudiante;
      delete data.descripcion;
      if (!data.imagen) delete data.imagen;
    } else if (data.rol === "tutor") {
      delete data.tareasUrl;
      delete data.tipoEstudiante;
      if (!data.imagen) delete data.imagen;
      if (!data.descripcion) delete data.descripcion;
    } else if (data.rol === "estudiante") {
      delete data.descripcion;
      if (!data.redes) delete data.redes;
      if (!data.imagen) delete data.imagen;
      if (!data.tareasUrl) delete data.tareasUrl;
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};


export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const requester = req.user;

    if (requester.rol !== "admin" && requester._id.toString() !== id)
      return res.status(403).json({ msg: "Acceso denegado" });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    const updates = req.body;

    if (typeof updates.redes === "string") {
      try {
        updates.redes = JSON.parse(updates.redes);
      } catch {
        return res.status(400).json({ msg: "Formato inválido en redes" });
      }
    }

    if (req.file && req.file.path) {
      updates.imagen = req.file.path;
    }

    // Validaciones por rol
    if (user.rol === "tutor") {
      if (updates.redes && updates.redes.length === 0)
        return res.status(400).json({ msg: "El tutor debe tener al menos una red" });
    }

    if (user.rol === "estudiante") {
      if (updates.tipoEstudiante && !["externo", "scesi", "umss"].includes(updates.tipoEstudiante))
        return res.status(400).json({ msg: "Tipo de estudiante inválido" });
    }

    Object.assign(user, updates);
    await user.save();

    res.json({
      msg: "Usuario actualizado",
      user: {
        id: user._id,
        nombre: user.nombre,
        apellidos: user.apellidos,
        rol: user.rol,
      },
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (req.user.rol !== "admin")
    return res.status(403).json({ msg: "Solo admin" });
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ msg: "No encontrado" });
  await deleteCloudImage(user.imagen);
  await user.deleteOne();
  res.json({ msg: "Usuario e imagen eliminados" });
};

async function deleteCloudImage(url) {
  if (!url) return;
  const parts = url.split("/");
  const publicId = parts.slice(-2).join("/").split(".")[0]; // carpeta/archivo sin extensión
  await cloudinary.uploader.destroy(publicId);
}
