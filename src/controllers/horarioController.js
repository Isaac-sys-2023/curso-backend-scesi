import Horario from "../models/Horario.js";
import Curso from "../models/Curso.js";
export const listHorarios = async (req, res) => {
  const horarios = await Horario.find({ curso: req.params.id });
  res.json(horarios);
};
export const createHorario = async (req, res) => {
  const curso = await Curso.findById(req.params.id);
  if (!curso) return res.status(404).json({ msg: "Curso no encontrado" });
  if (
    req.user.rol !== "admin" &&
    !curso.tutores.map((t) => t.toString()).includes(req.user._id.toString())
  )
    return res.status(403).json({ msg: "Acceso denegado" });
  const h = new Horario({ ...req.body, curso: req.params.id });
  await h.save();
  res.status(201).json(h);
};
export const updateHorario = async (req, res) => {
  const horario = await Horario.findById(req.params.idHorario);
  if (!horario) return res.status(404).json({ msg: "No encontrado" });
  const curso = await Curso.findById(horario.curso);
  if (
    req.user.rol !== "admin" &&
    !curso.tutores.map((t) => t.toString()).includes(req.user._id.toString())
  )
    return res.status(403).json({ msg: "Acceso denegado" });
  Object.assign(horario, req.body);
  await horario.save();
  res.json(horario);
};
export const deleteHorario = async (req, res) => {
  const horario = await Horario.findById(req.params.idHorario);
  if (!horario) return res.status(404).json({ msg: "No encontrado" });
  const curso = await Curso.findById(horario.curso);
  if (
    req.user.rol !== "admin" &&
    !curso.tutores.map((t) => t.toString()).includes(req.user._id.toString())
  )
    return res.status(403).json({ msg: "Acceso denegado" });
  await horario.remove();
  res.json({ msg: "Eliminado" });
};
