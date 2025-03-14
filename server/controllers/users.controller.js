import tokenUtils from '../utils/tokenUtils.js';
import { getOneUser, createNewUser, getAllUsers, updateOneUser, deleteUser } from '../models/sequelize/user.model.js';
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

// Obtener la ruta absoluta del directorio del proyecto
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '../../.env'); // Subir un nivel hasta 'inventoryApp/.env'

// Cargar el archivo .env manualmente
dotenv.config({ path: envPath });

// Usar variables de entorno
const sudoRole = parseInt(process.env.SUDO_ROLE);

/* ------------- FUNCTIONS ----------------*/

export default {
	/**
	 * Inicia sesión de un usuario y genera un token de autenticación.
	 *
	 * @async
	 * @function loginUser
	 * @param {object} req - Objeto de solicitud de Express.
	 * @param {object} res - Objeto de respuesta de Express.
	 * @returns {Promise<void>} - Envía una respuesta JSON.
	 * @throws {Error} - Lanza un error si hay un problema durante el inicio de sesión o la generación del token.
	 */
	loginUser: async (req, res) => {
		try {
			const { login_data, password } = req.body;

			if (!login_data || !password) {
				return res.status(400).json({
					ok: false,
					error: 'Faltan credenciales'
				});
			}

			const user = await getOneUser(login_data);

			//verificar usuario
			if (!user) {
				return res.status(404).json({
					ok: false,
					error: 'Usuario no encontrado.'
				});
			}

			//Verificar contraseña
			const validPass = await bcrypt.compare(password, user.pass);

			if (!validPass) {
				return res.status(401).json({
					ok: false,
					error: 'Credenciales incorrectas'
				});
			}

			// Datos que irán en el token
			const payload = {
				id: user.id,
				role: user.role_id,
				username: user.username,
				email: user.email,
				first_name: user.first_name,
				last_names: user.last_names
			};

			// Generar token de autenticación
			try {
				const tokenResponse = await tokenUtils.signJwt(payload);
				res.status(200).json({
					ok: true,
					message: tokenResponse.message,
					token: tokenResponse.token
				});
			} catch (error) {
				console.error('Error al generar el token:', error.message);
				return res.status(500).json({
					ok: false,
					message: 'Error al generar el token',
					error: error.message
				});
			}

		} catch (error) {
			console.error('Error en loginUser:', error);
			res.status(500).json({
				ok: false,
				message: 'Error en loginUser',
				error: error.message
			});
		}
	},

	/**
	 * Registra un nuevo usuario.
	 *
	 * @async
	 * @function registerUser
	 * @param {object} req - Objeto de solicitud de Express.
	 * @param {object} res - Objeto de respuesta de Express.
	 * @returns {Promise<void>} - Envía una respuesta JSON.
	 * @throws {Error} - Lanza un error si hay un problema durante el registro del usuario.
	 */
	registerUser: async (req, res) => {
		try {

			const { role_id, username, first_name, last_names, email, pass, address } = req.body;

			if (role_id === sudoRole) {
				return res.status(403).json({
					ok: false,
					error: 'No tienes autorización para crear este tipo de usuario'
				})
			}

			const data = {
				role_id,
				username,
				first_name,
				last_names,
				email,
				pass,
				address,
				isRegistered: false,
				isVisible: true
			};
			const newUser = await createNewUser(data);

			if (!newUser) {
				return res.status(409).json({
					ok: false,
					error: 'Usuario ya existe en la BD'
				});
			}

			const resp = {
				full_name: (`${newUser.first_name} ${newUser.last_names}`),
				dni: newUser.dni,
				phone: newUser.phone,
				email: newUser.email
			}

			res.status(201).json({
				ok: true,
				message: 'Nuevo usuario creado',
				data: resp
			});
		} catch (error) {
			res.status(500).json({
				ok: false,
				message: 'Error al crear usuario',
				error: error.message
			})
		}
	},

	/**
	 * Obtiene todos los usuarios.
	 *
	 * @async
	 * @function allUsers
	 * @param {object} req - Objeto de solicitud de Express.
	 * @param {object} res - Objeto de respuesta de Express.
	 * @returns {Promise<void>} - Envía una respuesta JSON.
	 * @throws {Error} - Lanza un error si hay un problema al listar los usuarios.
	 */
	allUsers: async (req, res) => {
		try {
			const users = await getAllUsers();

			const resp = users.map((user, i) => ({
				user: `${i + 1}`,
				username: `${user.username}`,
				full_name: (`${user.first_name} ${user.last_names}`),
				address: user.address,
				email: user.email
			}));

			// Enviar la respuesta combinada
			res.status(201).json({
				ok: true,
				message: 'Usuarios encontrados',
				data: resp
			})

		} catch (error) {
			res.status(500).json({
				ok: false,
				message: 'Error al listar usuarios',
				error: error.message
			})
		}
	},

	/**
	 * Obtiene un usuario por ID.
	 *
	 * @async
	 * @function oneUser
	 * @param {object} req - Objeto de solicitud de Express.
	 * @param {object} res - Objeto de respuesta de Express.
	 * @returns {Promise<void>} - Envía una respuesta JSON.
	 * @throws {Error} - Lanza un error si hay un problema al obtener el usuario.
	 */
	oneUser: async (req, res) => {
		try {
			// Obtener los datos del cuerpo de la solicitud
			const { userId } = req.params;
			const user = await getOneUser(userId);

			const resp = {
				username: `${user.username}`,
				full_name: (`${user.first_name} ${user.last_names}`),
				address: user.address,
				email: user.email
			};

			// Enviar la respuesta combinada
			res.status(201).json({
				ok: true,
				message: 'Usuario encontrado',
				data: resp
			})
		} catch (error) {
			res.status(500).json({
				ok: true,
				message: 'Error al listar el usuario',
				error: error.message
			})
		}
	},

	/**
	 * Actualiza un usuario por ID.
	 *
	 * @async
	 * @function updateUser
	 * @param {object} req - Objeto de solicitud de Express.
	 * @param {object} res - Objeto de respuesta de Express.
	 * @returns {Promise<void>} - Envía una respuesta JSON.
	 * @throws {Error} - Lanza un error si hay un problema al actualizar el usuario.
	 */
	updateUser: async (req, res) => {
		try {
			const { userId } = req.params;
			const { username, first_name, last_names, address, email } = req.body;
			const newData = {
				username,
				first_name,
				last_names,
				address,
				email
			};
			const user = await updateOneUser(userId, newData);
			return res.status(201).json({
				ok: true,
				message: "Datos del usuario modificado",
				data: user,
			});
		} catch (error) {
			res.status(500).json({
				ok: false,
				message: 'Error al actualizar el usuario',
				error: error.message
			})
		}
	},

	/**
	 * Elimina un usuario por ID.
	 *
	 * @async
	 * @function deleteUser
	 * @param {object} req - Objeto de solicitud de Express.
	 * @param {object} res - Objeto de respuesta de Express.
	 * @returns {Promise<void>} - Envía una respuesta JSON.
	 * @throws {Error} - Lanza un error si hay un problema al eliminar el usuario.
	 */
	deleteUser: async (req, res) => {
		try {
			const { userId } = req.params;
			const user = await deleteUser(userId);
			return res.status(201).json({
				ok: true,
				message: "El usuario ha sido eliminado",
				data: user
			});

		} catch (error) {
			res.status(500).json({
				ok: false,
				message: 'Error al eliminar el usuario',
				error: error.message
			})
		}
	},

	// TODO: Implementar función para cambiar contraseña, confirmar cuenta, recuperar contraseña
}