import express from "express";
import auth from "../middleware/auth.js";
import roles from "../middleware/roles.js";
import upload from "../middleware/uploadCloud.js";
import {
  listTechs,
  getTech,
  createTech,
  updateTech,
  deleteTech,
  deleteByNameVersion,
} from "../controllers/techController.js";

const router = express.Router();

router.get("/", listTechs);
router.get("/:nombre", getTech);
router.get("/:nombre/:version", getTech); 

router.post("/", auth, roles(["admin"]), upload.single("imgUrl"), createTech);
router.put("/:id", auth, roles(["admin"]), upload.single("imgUrl"), updateTech);
router.delete("/:id", auth, roles(["admin"]), deleteTech);
router.delete("/:nombre/:version", auth, roles(["admin"]), deleteByNameVersion);

/**
 * @swagger
 * tags:
 *   name: Tech
 *   description: Gestión de tecnologías y sus versiones
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Tech:
 *       type: object
 *       required:
 *         - nombre
 *         - version
 *       properties:
 *         _id:
 *           type: string
 *           description: ID autogenerado por MongoDB
 *         nombre:
 *           type: string
 *           description: Nombre de la tecnología
 *           example: Angular
 *         version:
 *           type: string
 *           description: Versión de la tecnología
 *           example: "17"
 *         imgUrl:
 *           type: string
 *           description: URL de la imagen en Cloudinary
 *           example: https://res.cloudinary.com/demo/angular17.png
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/tech:
 *   get:
 *     summary: Listar todas las tecnologías con sus versiones
 *     tags: [Tech]
 *     responses:
 *       200:
 *         description: Lista de tecnologías
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tech'
 */

/**
 * @swagger
 * /api/tech/{nombre}:
 *   get:
 *     summary: Obtener todas las versiones de una tecnología
 *     tags: [Tech]
 *     parameters:
 *       - name: nombre
 *         in: path
 *         required: true
 *         description: Nombre de la tecnología (ej. Angular)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de versiones encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tech'
 *       404:
 *         description: Tecnología no encontrada
 */

/**
 * @swagger
 * /api/tech/{nombre}/{version}:
 *   get:
 *     summary: Obtener una versión específica de una tecnología
 *     tags: [Tech]
 *     parameters:
 *       - name: nombre
 *         in: path
 *         required: true
 *         description: Nombre de la tecnología
 *         schema:
 *           type: string
 *       - name: version
 *         in: path
 *         required: true
 *         description: Versión de la tecnología
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalle de la tecnología
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tech'
 *       404:
 *         description: No encontrada
 */

/**
 * @swagger
 * /api/tech:
 *   post:
 *     summary: Crear una nueva tecnología (solo admin)
 *     tags: [Tech]
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
 *               - version
 *               - imgUrl
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Angular
 *               version:
 *                 type: string
 *                 example: "17"
 *               imgUrl:
 *                 type: string
 *                 format: binary
 *                 description: Imagen subida al Cloudinary
 *     responses:
 *       201:
 *         description: Tecnología creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tech'
 *       400:
 *         description: Error de validación o duplicado
 *       403:
 *         description: Solo el rol admin puede realizar esta acción
 */

/**
 * @swagger
 * /api/tech/{id}:
 *   put:
 *     summary: Actualizar una tecnología existente (solo admin)
 *     tags: [Tech]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la tecnología
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Angular
 *               version:
 *                 type: string
 *                 example: "18"
 *               imgUrl:
 *                 type: string
 *                 format: binary
 *                 description: Nueva imagen
 *     responses:
 *       200:
 *         description: Tecnología actualizada
 *       403:
 *         description: Solo el rol admin puede actualizar
 *       404:
 *         description: Tecnología no encontrada
 */

/**
 * @swagger
 * /api/tech/{id}:
 *   delete:
 *     summary: Eliminar una tecnología por ID (solo admin)
 *     tags: [Tech]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la tecnología
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Eliminada correctamente
 *       403:
 *         description: Solo el rol admin puede eliminar
 *       404:
 *         description: No encontrada
 */

/**
 * @swagger
 * /api/tech/{nombre}/{version}:
 *   delete:
 *     summary: Eliminar una versión específica de una tecnología (solo admin)
 *     tags: [Tech]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: nombre
 *         in: path
 *         required: true
 *         description: Nombre de la tecnología
 *         schema:
 *           type: string
 *       - name: version
 *         in: path
 *         required: true
 *         description: Versión específica
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Versión eliminada
 *       403:
 *         description: Solo el rol admin puede eliminar
 *       404:
 *         description: No encontrada
 */


export default router;
