import Tech from "../models/Tech.js";
import cloudinary from "../config/cloudinary.js";

async function deleteCloudImage(url) {
  if (!url) return;
  const parts = url.split("/");
  const publicId = parts.slice(-2).join("/").split(".")[0];
  await cloudinary.uploader.destroy(publicId);
}

export const listTechs = async (req, res) => {
  const t = await Tech.find();
  res.json(t);
};

export const getTech = async (req, res) => {
  const { nombre, version } = req.params;

  if (version) {
    const tech = await Tech.findOne({ nombre, version });
    if (!tech) return res.status(404).json({ msg: "Versión no encontrada" });
    return res.json(tech);
  }

  const techs = await Tech.find({ nombre });
  if (!techs.length)
    return res.status(404).json({ msg: "Tecnología no encontrada" });

  res.json(techs);
};

export const createTech = async (req, res) => {
  if (req.user.rol !== "admin")
    return res.status(403).json({ msg: "Solo admin" });

  const imgUrl = req.file?.path;
  if (!imgUrl) return res.status(400).json({ msg: "Imagen requerida" });

  const { nombre, version } = req.body;
  if (!nombre || !version)
    return res.status(400).json({ msg: "Nombre y versión son requeridos" });

  try {
    const tech = new Tech({ nombre, version, imgUrl });
    await tech.save();
    res.status(201).json(tech);
  } catch (err) {
    if (err.code === 11000)
      return res
        .status(400)
        .json({ msg: "Esta versión de la tecnología ya existe" });
    res.status(500).json({ msg: "Error al crear", error: err.message });
  }
};

export const updateTech = async (req, res) => {
  if (req.user.rol !== "admin")
    return res.status(403).json({ msg: "Solo admin" });

  const tech = await Tech.findById(req.params.id);
  if (!tech) return res.status(404).json({ msg: "No encontrado" });

  if (req.file) {
    await deleteCloudImage(tech.imgUrl);
    tech.imgUrl = req.file.path;
  }

  if (req.body.nombre) tech.nombre = req.body.nombre;
  if (req.body.version) tech.version = req.body.version;

  await tech.save();
  res.json(tech);
};

export const deleteTech = async (req, res) => {
  if (req.user.rol !== "admin")
    return res.status(403).json({ msg: "Solo admin" });
  const tech = await Tech.findById(req.params.id);
  if (!tech) return res.status(404).json({ msg: "No encontrado" });
  await deleteCloudImage(tech.imgUrl);
  await tech.deleteOne();
  res.json({ msg: "Tech e imagen eliminadas" });
};

export const deleteByNameVersion = async (req, res) => {
  if (req.user.rol !== "admin")
    return res.status(403).json({ msg: "Solo admin" });

  const { nombre, version } = req.params;
  const tech = await Tech.findOne({ nombre, version });
  if (!tech) return res.status(404).json({ msg: "No encontrado" });

  await deleteCloudImage(tech.imgUrl);
  await tech.deleteOne();

  res.json({ msg: "Tech versión eliminada" });
};

