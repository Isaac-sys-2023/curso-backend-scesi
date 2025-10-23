import Curso from "../models/Curso.js";
import Horario from "../models/Horario.js";
import cloudinary from "../config/cloudinary.js";

export const listCursos = async (req, res) => {
  const cursos = await Curso.find()
    .populate("techs tutores estudiantes horarios", "-password")
    .sort({ fechaInicio: 1 });
  res.json(cursos);
};

export const getCurso = async (req, res) => {
  try {
    const curso = await Curso.findById(req.params.id).populate(
      "techs tutores estudiantes horarios",
      "-password"
    );

    if (!curso) return res.status(404).json({ msg: "No encontrado" });

    // Si no hay header de autorización, consideramos visitante
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      const c = curso.toObject();
      delete c.estudiantes;
      return res.json(c);
    }

    // Si hay token, el middleware auth lo habrá resuelto antes
    res.json(curso);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

export const createCurso = async (req, res) => {
  if (req.user.rol !== "admin")
    return res.status(403).json({ msg: "Solo admin" });

  try {
    const {
      titulo,
      descripcion,
      fechaInicio,
      fechaFin,
      duracionEnSemanas,
      precioGeneral,
      precioUMSS,
      status,
      techs,
      tutores,
      horarios,
    } = req.body;

    // ✅ Validar campos requeridos
    if (
      !titulo ||
      !descripcion ||
      !fechaInicio ||
      !fechaFin ||
      !duracionEnSemanas ||
      !precioGeneral ||
      !precioUMSS ||
      !status ||
      !techs ||
      !tutores ||
      !horarios
    ) {
      return res.status(400).json({ msg: "Faltan campos requeridos" });
    }

    // ✅ Validar formato de fechas
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    if (isNaN(inicio) || isNaN(fin)) {
      return res.status(400).json({ msg: "Formato de fecha inválido" });
    }

    // ✅ Crear el curso con las imágenes
    const curso = new Curso({
      titulo,
      descripcion,
      fechaInicio: inicio,
      fechaFin: fin,
      duracionEnSemanas,
      precioGeneral,
      precioUMSS,
      status,
      techs: Array.isArray(techs) ? techs : [techs],
      tutores: Array.isArray(tutores) ? tutores : [tutores],
      imgCurso: req.files?.imgCurso?.[0]?.path,
      aficheImg: req.files?.aficheImg?.[0]?.path,
      horarios: Array.isArray(horarios) ? horarios : [horarios],
    });

    await curso.save();
    res.status(201).json(curso);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const updateCurso = async (req, res) => {
  const curso = await Curso.findById(req.params.id);
  if (!curso) return res.status(404).json({ msg: "No encontrado" });
  if (
    req.user.rol !== "admin" &&
    !curso.tutores.map((t) => t.toString()).includes(req.user._id.toString())
  )
    return res.status(403).json({ msg: "Acceso denegado" });

  if (req.files?.imgCurso) {
    await deleteCloudImage(curso.imgCurso);
    curso.imgCurso = req.files.imgCurso[0].path;
  }
  if (req.files?.aficheImg) {
    await deleteCloudImage(curso.aficheImg);
    curso.aficheImg = req.files.aficheImg[0].path;
  }

  if (req.body.fechaInicio)
    req.body.fechaInicio = new Date(req.body.fechaInicio);
  if (req.body.fechaFin) req.body.fechaFin = new Date(req.body.fechaFin);

  Object.assign(curso, req.body);
  await curso.save();
  res.json(curso);
};

export const deleteCurso = async (req, res) => {
  if (req.user.rol !== "admin")
    return res.status(403).json({ msg: "Solo admin" });
  const curso = await Curso.findById(req.params.id);
  if (!curso) return res.status(404).json({ msg: "No encontrado" });

  await deleteCloudImage(curso.imgCurso);
  await deleteCloudImage(curso.aficheImg);
  await curso.deleteOne();

  res.json({ msg: "Curso e imágenes eliminadas" });
};

export const addEstudiante = async (req, res) => {
  const { id } = req.params; // curso id
  const { userId } = req.body;
  const curso = await Curso.findById(id);
  if (!curso) return res.status(404).json({ msg: "Curso no encontrado" });
  // only admin or tutor assigned
  if (
    req.user.rol !== "admin" &&
    !curso.tutores.map((t) => t.toString()).includes(req.user._id.toString())
  )
    return res.status(403).json({ msg: "Acceso denegado" });
  if (curso.estudiantes.map((e) => e.toString()).includes(userId))
    return res.status(400).json({ msg: "Ya inscrito" });
  curso.estudiantes.push(userId);
  await curso.save();
  res.json(curso);
};

export const removeEstudiante = async (req, res) => {
  const { id, userId } = req.params;
  const curso = await Curso.findById(id);
  if (!curso) return res.status(404).json({ msg: "Curso no encontrado" });
  if (
    req.user.rol !== "admin" &&
    !curso.tutores.map((t) => t.toString()).includes(req.user._id.toString())
  )
    return res.status(403).json({ msg: "Acceso denegado" });
  curso.estudiantes = curso.estudiantes.filter((e) => e.toString() !== userId);
  await curso.save();
  res.json(curso);
};

async function deleteCloudImage(url) {
  if (!url) return;
  const parts = url.split("/");
  const publicId = parts.slice(-2).join("/").split(".")[0];
  await cloudinary.uploader.destroy(publicId);
}
