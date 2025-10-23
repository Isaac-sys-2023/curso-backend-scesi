import RedSocial from "../models/RedSocial.js";
import cloudinary from "../config/cloudinary.js";

async function deleteCloudImage(url) {
  if (!url) return;
  const parts = url.split("/");
  const publicId = parts.slice(-2).join("/").split(".")[0];
  await cloudinary.uploader.destroy(publicId);
}

export const listRedes = async (req, res) => {
  const redes = await RedSocial.find();
  res.json(redes);
};

export const createRed = async (req, res) => {
  try {
    if (req.user.rol !== "admin")
      return res.status(403).json({ msg: "Solo admin" });

    const img = req.file?.path;
    if (!img) return res.status(400).json({ msg: "Imagen requerida" });

    const exists = await RedSocial.findOne({ nombre: req.body.nombre });
    if (exists) return res.status(400).json({ msg: "Red social ya existe" });

    const red = new RedSocial({ nombre: req.body.nombre, img });
    await red.save();
    res.status(201).json(red);
  } catch (err) {
    res.status(500).json({ msg: "Error en servidor", err: err.message });
  }
};

export const updateRed = async (req, res) => {
  try {
    if (req.user.rol !== "admin")
      return res.status(403).json({ msg: "Solo admin" });

    const red = await RedSocial.findById(req.params.id);
    if (!red) return res.status(404).json({ msg: "No encontrado" });

    const exists = await RedSocial.findOne({
      nombre: req.body.nombre,
      _id: { $ne: req.params.id },
    });
    if (exists) return res.status(400).json({ msg: "Red social ya existe" });

    if (req.file) {
      await deleteCloudImage(red.img);
      red.img = req.file.path;
    }
    if (req.body.nombre) red.nombre = req.body.nombre;

    await red.save();
    res.json(red);
  } catch (err) {
    res.status(500).json({ msg: "Error en servidor", err: err.message });
  }
};

export const deleteRed = async (req, res) => {
  try {
    if (req.user.rol !== "admin")
      return res.status(403).json({ msg: "Solo admin" });
    const red = await RedSocial.findById(req.params.id);
    if (!red) return res.status(404).json({ msg: "No encontrado" });
    await deleteCloudImage(red.img);
    await red.deleteOne();
    res.json({ msg: "Red e imagen eliminadas" });
  } catch (err) {
    res.status(500).json({ msg: "Error en servidor", err: err.message });
  }
};
