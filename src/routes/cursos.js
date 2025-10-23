import express from "express";
import auth from "../middleware/auth.js";
import roles from "../middleware/roles.js";
import {
  listCursos,
  getCurso,
  createCurso,
  updateCurso,
  deleteCurso,
  addEstudiante,
  removeEstudiante,
} from "../controllers/cursoController.js";
import upload from "../middleware/uploadCloud.js";

const router = express.Router();

// público total
router.get("/", listCursos);
router.get("/:id", getCurso); // ahora es público

router.post(
  "/",
  auth,
  roles(["admin"]),
  upload.fields([{ name: "imgCurso" }, { name: "aficheImg" }]),
  createCurso
);
router.put(
  "/:id",
  auth,
  upload.fields([{ name: "imgCurso" }, { name: "aficheImg" }]),
  updateCurso
);
router.delete("/:id", auth, roles(["admin"]), deleteCurso);

router.post("/:id/estudiantes", auth, addEstudiante);
router.delete("/:id/estudiantes/:userId", auth, removeEstudiante);

/**
 * @swagger
 * tags:
 *   name: Cursos
 *   description: Endpoints para la gestión de cursos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Curso:
 *       type: object
 *       required:
 *         - titulo
 *         - descripcion
 *         - fechaInicio
 *         - fechaFin
 *         - duracionEnSemanas
 *         - precioGeneral
 *         - precioUMSS
 *         - status
 *         - techs
 *         - tutores
 *         - horarios
 *       properties:
 *         _id:
 *           type: string
 *           description: ID autogenerado por MongoDB
 *         titulo:
 *           type: string
 *           example: "Curso de React con TypeScript"
 *         descripcion:
 *           type: string
 *           example: "Aprende a desarrollar aplicaciones modernas con React y TypeScript."
 *         fechaInicio:
 *           type: string
 *           format: date
 *           example: "2025-04-01"
 *         fechaFin:
 *           type: string
 *           format: date
 *           example: "2025-05-27"
 *         duracionEnSemanas:
 *           type: number
 *           example: 8
 *         precioGeneral:
 *           type: number
 *           example: 250
 *         precioUMSS:
 *           type: number
 *           example: 180
 *         status:
 *           type: string
 *           enum: ["Por Iniciar", "En Progreso", "Finalizado"]
 *           example: "Por Iniciar"
 *         estaCancelado:
 *           type: boolean
 *           default: false
 *         imgCurso:
 *           type: string
 *           description: URL de la imagen del curso
 *           example: "https://res.cloudinary.com/demo/image/upload/v123456/react-course.png"
 *         aficheImg:
 *           type: string
 *           description: URL del afiche del curso
 *           example: "https://res.cloudinary.com/demo/image/upload/v123456/afiche.png"
 *         techs:
 *           type: array
 *           items:
 *             type: string
 *           description: IDs de tecnologías usadas en el curso
 *           example: ["673ce23b5b0a0f4d2e9fcd45"]
 *         tutores:
 *           type: array
 *           items:
 *             type: string
 *           description: IDs de los tutores asignados
 *           example: ["673ce40b5b0a0f4d2e9fcd50"]
 *         estudiantes:
 *           type: array
 *           items:
 *             type: string
 *           description: IDs de los estudiantes inscritos
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         horarios:
 *           type: array
 *           items:
 *             type: string
 *           description: IDs de los horarios del curso
 *           example: ["673ce55b5b0a0f4d2e9fcd60"]
 */

/**
 * @swagger
 * /api/cursos:
 *   get:
 *     summary: Listar todos los cursos
 *     tags: [Cursos]
 *     responses:
 *       200:
 *         description: Lista de cursos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Curso'
 */

/**
 * @swagger
 * /api/cursos/{id}:
 *   get:
 *     summary: Obtener información de un curso
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del curso
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Curso encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Curso'
 *       404:
 *         description: Curso no encontrado
 */

/**
 * @swagger
 * /api/cursos:
 *   post:
 *     summary: Crear un nuevo curso (solo admin)
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - descripcion
 *               - fechaInicio
 *               - fechaFin
 *               - duracionEnSemanas
 *               - precioGeneral
 *               - precioUMSS
 *               - status
 *               - techs
 *               - tutores
 *             properties:
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               fechaInicio:
 *                 type: string
 *                 format: date
 *               fechaFin:
 *                 type: string
 *                 format: date
 *               duracionEnSemanas:
 *                 type: number
 *               precioGeneral:
 *                 type: number
 *               precioUMSS:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: ["Por Iniciar", "En Progreso", "Finalizado"]
 *               techs:
 *                 type: array
 *                 items:
 *                   type: string
 *               tutores:
 *                 type: array
 *                 items:
 *                   type: string
 *               imgCurso:
 *                 type: string
 *                 format: binary
 *               aficheImg:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Curso creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Curso'
 *       403:
 *         description: Solo admin puede crear cursos
 */

/**
 * @swagger
 * /api/cursos/{id}:
 *   put:
 *     summary: Actualizar un curso existente (admin o tutor asignado)
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del curso
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               fechaInicio:
 *                 type: string
 *                 format: date
 *               fechaFin:
 *                 type: string
 *                 format: date
 *               duracionEnSemanas:
 *                 type: number
 *               precioGeneral:
 *                 type: number
 *               precioUMSS:
 *                 type: number
 *               status:
 *                 type: string
 *               techs:
 *                 type: array
 *                 items:
 *                   type: string
 *               tutores:
 *                 type: array
 *                 items:
 *                   type: string
 *               imgCurso:
 *                 type: string
 *                 format: binary
 *               aficheImg:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Curso actualizado correctamente
 *       403:
 *         description: Solo admin o tutor asignado puede editar
 *       404:
 *         description: Curso no encontrado
 */

/**
 * @swagger
 * /api/cursos/{id}:
 *   delete:
 *     summary: Eliminar un curso (solo admin)
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del curso
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Curso eliminado correctamente
 *       404:
 *         description: Curso no encontrado
 */

/**
 * @swagger
 * /api/cursos/{id}/estudiantes:
 *   post:
 *     summary: Agregar estudiante a un curso (admin o tutor)
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del curso
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID del estudiante a agregar
 *     responses:
 *       200:
 *         description: Estudiante agregado
 *       403:
 *         description: Solo admin o tutor puede agregar
 *       404:
 *         description: Curso no encontrado
 */

/**
 * @swagger
 * /api/cursos/{id}/estudiantes/{userId}:
 *   delete:
 *     summary: Quitar estudiante de un curso (admin o tutor)
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del curso
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID del estudiante
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estudiante removido del curso
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Curso no encontrado
 */

export default router;
