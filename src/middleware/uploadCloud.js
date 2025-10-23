import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// Storage dinámico según tipo de entidad
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "generales";
    if (req.baseUrl.includes("users")) folder = "usuarios";
    if (req.baseUrl.includes("techs")) folder = "tecnologias";
    if (req.baseUrl.includes("cursos")) folder = "cursos";
    if (req.baseUrl.includes("redes")) folder = "redes";
    return { folder };
  },
});

const upload = multer({ storage });

export default upload;
