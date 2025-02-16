import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validateDto } from "@utils/middlewares/validateDto.middleware";
import { CreateUserDto } from "@modules/users/domain/dtos/user.dto";

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar usuario
 *     description: Permite a un usuario registrarse en la aplicación.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserDto'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Identificador único del usuario
 *                   example: 60f6f3b3f9a9e3f1e0c4a5c2
 *                 name:
 *                   type: string
 *                   description: Nombre del usuario
 *                   example: Juan Pérez
 *                 email:
 *                   type: string
 *                   description: Correo electrónico del usuario
 *                   example: juan.perez@example.com
 *       400:
 *         description: Solicitud incorrecta (por ejemplo, datos faltantes o incorrectos)
 *       500:
 *         description: Error interno del servidor
 */
router.post("/register", validateDto(CreateUserDto), AuthController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Permite a un usuario iniciar sesión en la aplicación.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *                 example: usuario@example.com
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *                 example: contraseña123
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token de autenticación
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Solicitud incorrecta (por ejemplo, datos faltantes o incorrectos)
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error interno del servidor
 */
router.post("/login", AuthController.login);

export const AuthRoutes = router;
