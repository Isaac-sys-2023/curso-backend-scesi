import express from "express";
import auth from "../middleware/auth.js";
import roles from "../middleware/roles.js";
import upload from "../middleware/uploadCloud.js";
import {
  listRedes,
  createRed,
  updateRed,
  deleteRed,
} from "../controllers/redSocialController.js";

const router = express.Router();

router.get("/", listRedes);

router.post("/", auth, roles(["admin"]), upload.single("img"), createRed);
router.put("/:id", auth, roles(["admin"]), upload.single("img"), updateRed);
router.delete("/:id", auth, roles(["admin"]), deleteRed);

/**
 * @swagger
 * tags:
 *   name: Redes Sociales
 *   description: Gestión de redes sociales (solo administradores)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RedSocial:
 *       type: object
 *       required:
 *         - nombre
 *         - img
 *       properties:
 *         _id:
 *           type: string
 *           description: ID autogenerado de la red social
 *         nombre:
 *           type: string
 *           example: Facebook
 *         img:
 *           type: string
 *           description: URL del logo o ícono en Cloudinary
 *           example: https://res.cloudinary.com/demo/image/upload/v1729000/facebook.png
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /redes:
 *   get:
 *     summary: Listar todas las redes sociales
 *     tags: [Redes Sociales]
 *     responses:
 *       200:
 *         description: Lista de redes sociales disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RedSocial'
 *
 *   post:
 *     summary: Crear una nueva red social
 *     tags: [Redes Sociales]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - img
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Instagram
 *               img:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Red social creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RedSocial'
 *       400:
 *         description: Falta imagen o nombre ya existente
 *       403:
 *         description: Solo administradores pueden crear redes
 *       500:
 *         description: Error interno del servidor
 *
 * /redes/{id}:
 *   put:
 *     summary: Actualizar una red social
 *     tags: [Redes Sociales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la red social a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: TikTok
 *               img:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Red social actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RedSocial'
 *       400:
 *         description: Nombre duplicado o datos inválidos
 *       403:
 *         description: Solo administradores pueden actualizar
 *       404:
 *         description: Red social no encontrada
 *       500:
 *         description: Error interno del servidor
 *
 *   delete:
 *     summary: Eliminar una red social
 *     tags: [Redes Sociales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la red social a eliminar
 *     responses:
 *       200:
 *         description: Red social eliminada exitosamente
 *       403:
 *         description: Solo administradores pueden eliminar
 *       404:
 *         description: No encontrada
 *       500:
 *         description: Error interno del servidor
 */


export default router;
