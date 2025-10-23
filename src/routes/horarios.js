import express from "express";
import auth from "../middleware/auth.js";
import roles from "../middleware/roles.js";
import {
  listHorarios,
  createHorario,
  updateHorario,
  deleteHorario,
} from "../controllers/horarioController.js";
const router = express.Router();
router.get("/:id/horarios", listHorarios);
router.post("/:id/horarios", auth, createHorario);
router.put("/:id/horarios/:idHorario", auth, updateHorario);
router.delete("/:id/horarios/:idHorario", auth, deleteHorario);

/**
 * @swagger
 * tags:
 *   name: Horarios
 *   description: Gestión de horarios por curso
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Horario:
 *       type: object
 *       required:
 *         - dia
 *         - horaInicio
 *         - horaFin
 *         - modalidad
 *       properties:
 *         _id:
 *           type: string
 *           description: ID autogenerado del horario
 *         dia:
 *           type: string
 *           enum: [Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo]
 *           example: Lunes
 *         horaInicio:
 *           type: string
 *           example: "08:30"
 *         horaFin:
 *           type: string
 *           example: "10:00"
 *         modalidad:
 *           type: string
 *           enum: [virtual, presencial, híbrido]
 *           example: presencial
 *         curso:
 *           type: string
 *           description: ID del curso asociado
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /cursos/{id}/horarios:
 *   get:
 *     summary: Listar horarios de un curso
 *     tags: [Horarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del curso
 *     responses:
 *       200:
 *         description: Lista de horarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Horario'
 *
 *   post:
 *     summary: Crear horario para un curso
 *     tags: [Horarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del curso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Horario'
 *     responses:
 *       201:
 *         description: Horario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Horario'
 *       403:
 *         description: Solo administradores o tutores del curso pueden crear horarios
 *
 * /cursos/{id}/horarios/{idHorario}:
 *   put:
 *     summary: Actualizar horario de un curso
 *     tags: [Horarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del curso
 *       - in: path
 *         name: idHorario
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del horario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Horario'
 *     responses:
 *       200:
 *         description: Horario actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Horario'
 *       403:
 *         description: No autorizado
 *
 *   delete:
 *     summary: Eliminar horario
 *     tags: [Horarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: idHorario
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Horario eliminado exitosamente
 *       403:
 *         description: No autorizado
 */


export default router;
