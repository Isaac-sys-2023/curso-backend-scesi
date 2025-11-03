import express from "express";
import auth from "../middleware/auth.js";
import roles from "../middleware/roles.js";
import upload from "../middleware/uploadCloud.js";
import {
  listUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
const router = express.Router();
router.get("/", auth, roles(["admin"]), listUsers);
router.get("/:id", auth, getUser);
// router.put("/:id", auth, updateUser);
router.patch("/:id", auth, upload.single("imagen"), updateUser);
router.delete("/:id", auth, roles(["admin"]), deleteUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Listar todos los usuarios
 *     description: Devuelve todos los usuarios. Solo accesible por admins.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 oneOf:
 *                   - $ref: '#/components/schemas/UserAdmin'
 *                   - $ref: '#/components/schemas/UserTutor'
 *                   - $ref: '#/components/schemas/UserEstudiante'
 *       403:
 *         description: No autorizado
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtener información de un usuario por ID
 *     description: Devuelve solo los campos válidos según el rol del usuario.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Datos del usuario encontrados
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/UserAdmin'
 *                 - $ref: '#/components/schemas/UserTutor'
 *                 - $ref: '#/components/schemas/UserEstudiante'
 *       403:
 *         description: No autorizado para ver este usuario
 *       404:
 *         description: Usuario no encontrado
 *
 *   patch:
 *     summary: Actualizar parcialmente los datos de un usuario
 *     description: Permite que el usuario o un admin actualicen campos válidos según su rol.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/schemas/UserUpdateTutor'
 *               - $ref: '#/components/schemas/UserUpdateEstudiante'
 *               - $ref: '#/components/schemas/UserUpdateAdmin'
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       400:
 *         description: Campos inválidos
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserAdmin:
 *       type: object
 *       properties:
 *         _id: { type: string, example: "6718b6d9f0a2cd1aef43d0f1" }
 *         nombre: { type: string, example: "Laura" }
 *         apellidos: { type: string, example: "Mendoza" }
 *         email: { type: string, example: "laura@admin.com" }
 *         rol: { type: string, example: "admin" }
 *         imagen: { type: string, example: "https://res.cloudinary.com/.../foto.png" }
 *
 *     UserTutor:
 *       type: object
 *       properties:
 *         _id: { type: string, example: "6718b6d9f0a2cd1aef43d0f2" }
 *         nombre: { type: string, example: "Isaac" }
 *         apellidos: { type: string, example: "Gutierrez" }
 *         email: { type: string, example: "isaac@tutor.com" }
 *         rol: { type: string, example: "tutor" }
 *         descripcion: { type: string, example: "Desarrollador Fullstack" }
 *         redes:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               red: { type: string, example: "6717c95f924d7d4408a59c0d" }
 *               url: { type: string, example: "https://linkedin.com/in/isaac" }
 *
 *     UserEstudiante:
 *       type: object
 *       properties:
 *         _id: { type: string, example: "6718b6d9f0a2cd1aef43d0f3" }
 *         nombre: { type: string, example: "Carlos" }
 *         apellidos: { type: string, example: "Ramirez" }
 *         email: { type: string, example: "carlos@umss.com" }
 *         rol: { type: string, example: "estudiante" }
 *         tipoEstudiante: { type: string, example: "umss" }
 *         tareasUrl: { type: string, example: "https://github.com/carlosr/tareas" }
 *
 *     UserUpdateTutor:
 *       allOf:
 *         - $ref: '#/components/schemas/UserTutor'
 *       required: [descripcion, redes]
 *     UserUpdateEstudiante:
 *       allOf:
 *         - $ref: '#/components/schemas/UserEstudiante'
 *     UserUpdateAdmin:
 *       allOf:
 *         - $ref: '#/components/schemas/UserAdmin'
 */


export default router;