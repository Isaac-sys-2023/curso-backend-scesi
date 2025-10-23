import express from "express";
import {
  register,
  login,
  changePassword,
} from "../controllers/authController.js";
import auth from "../middleware/auth.js";
import roles from '../middleware/roles.js';
import upload from "../middleware/uploadCloud.js";

const router = express.Router();

//router.post("/register", register); // by default we allowed registration via admin only in controllers? keep simple: open
router.post('/register', auth, roles(['admin']), upload.single("imagen"), register);

router.post("/login", login);
router.post("/change-password", auth, changePassword);

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Endpoints relacionados con la autenticación de usuarios y gestión de contraseñas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterBase:
 *       type: object
 *       required:
 *         - nombre
 *         - apellidos
 *         - email
 *         - password
 *         - fechaNacimiento
 *         - rol
 *       properties:
 *         nombre:
 *           type: string
 *           example: Isaac
 *         apellidos:
 *           type: string
 *           example: Gutiérrez Huarachi
 *         email:
 *           type: string
 *           example: isaac@example.com
 *         password:
 *           type: string
 *           example: 12345678
 *         fechaNacimiento:
 *           type: string
 *           format: date
 *           example: "1998-06-15"
 *         rol:
 *           type: string
 *           enum: [admin, tutor, estudiante]
 *           example: tutor
 *         imagen:
 *           type: string
 *           format: binary
 *           description: Archivo de imagen que será subido a Cloudinary
 *
 *     RegisterAdmin:
 *       allOf:
 *         - $ref: '#/components/schemas/RegisterBase'
 *       description: Registro de usuario administrador (solo datos básicos)
 *
 *     RegisterTutor:
 *       allOf:
 *         - $ref: '#/components/schemas/RegisterBase'
 *       required:
 *         - redes
 *       properties:
 *         descripcion:
 *           type: string
 *           example: "Tutor de programación web"
 *         redes:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               red:
 *                 type: string
 *                 description: ID de la red social registrada
 *                 example: "6717c95f924d7d4408a59c0d"
 *               url:
 *                 type: string
 *                 example: "https://linkedin.com/in/isaac"
 *
 *     RegisterEstudiante:
 *       allOf:
 *         - $ref: '#/components/schemas/RegisterBase'
 *       required:
 *         - tipoEstudiante
 *       properties:
 *         tipoEstudiante:
 *           type: string
 *           enum: [externo, scesi, umss]
 *           example: "umss"
 *         tareasUrl:
 *           type: string
 *           example: "https://github.com/isaac-umss/tareas"
 *         redes:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               red:
 *                 type: string
 *                 example: "6717c95f924d7d4408a59c0d"
 *               url:
 *                 type: string
 *                 example: "https://facebook.com/isaac"
 *
 *     UserLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: isaac@example.com
 *         password:
 *           type: string
 *           example: "12345678"
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: JWT generado tras un login exitoso
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *
 *     ChangePasswordRequest:
 *       type: object
 *       required:
 *         - currentPassword
 *         - newPassword
 *       properties:
 *         currentPassword:
 *           type: string
 *           example: "12345678"
 *         newPassword:
 *           type: string
 *           example: "abcd1234"
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario con imagen
 *     description: >
 *       Crea un usuario según su rol (admin, tutor o estudiante).  
 *       Solo los administradores pueden registrar usuarios.  
 *       El campo **imagen** debe enviarse como archivo, no como URL.  
 *       El servidor subirá la imagen a Cloudinary y almacenará su URL.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/schemas/RegisterAdmin'
 *               - $ref: '#/components/schemas/RegisterTutor'
 *               - $ref: '#/components/schemas/RegisterEstudiante'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 msg: "Usuario creado"
 *                 id: "6718b6d9f0a2cd1aef43d0f3"
 *                 rol: "tutor"
 *       400:
 *         description: Campos faltantes o rol inválido
 *       403:
 *         description: Solo administradores pueden registrar usuarios
 *       500:
 *         description: Error en el servidor
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión y obtener token JWT
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Login exitoso, devuelve JWT
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Credenciales inválidas
 */

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Cambiar la contraseña del usuario autenticado
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente
 *       400:
 *         description: Contraseña actual incorrecta
 *       401:
 *         description: Token inválido o no proporcionado
 *       404:
 *         description: Usuario no encontrado
 */


export default router;
