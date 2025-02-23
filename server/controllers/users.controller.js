import tokenUtils from '../utils/tokenUtils.js';
import { getOneUser, createNewUser, getAllUsers, updateOneUser, deleteUser } from '../models/sequelize/user.model.js';
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Obtener la ruta absoluta del directorio del proyecto
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '../../.env'); // Subir un nivel hasta 'inventoryApp/.env'

// Cargar el archivo .env manualmente
dotenv.config({ path: envPath });

// Usar variables de entorno
const SECRET_KEY = process.env.SECRET_KEY;

/* ------------- FUNCTIONS ----------------*/

export default {
	/**
	 * Login de usuario
	 * @param {*} req --> Request
	 * @param {*} res --> Response
	 * @returns {*} --> Mensaje de éxito o error
	 */
	loginUser: async (req, res) => {
		try {
			const { login_data, password } = req.body;

			if(!login_data || !password){
				return res.status(400).json({ error: 'Faltan credenciales' });
			}

			const user = await getOneUser(login_data);

			//verificar usuario
			if (!user) {
				return res.status(404).json({ error: 'Usuario no encontrado.' });
			}

			//Verificar contraseña
			if (user.pass != password) {
				return res.status(401).json({ error: 'Credenciales incorrectas' });
			}

			//Generar token de autenticación utilizando tokenUtils.signJwt
			try {
				const tokenResponse = await tokenUtils.signJwt(user);
				res.status(200).json({
					user: user.email,
					message: tokenResponse.message,
					token: tokenResponse.token
				});
			} catch (error) {
				console.error('Error al generar el token:', error);
				return res.status(500).json({ error: 'Error al generar el token', details: error });
			}

		} catch (error) {
			console.error('Error en loginUser:', error);
			res.status(500).json({ message: 'Error en loginUser', error: error.message });
		}
	},

	registerUser: async (req, res) => {
		try {
			const { username, first_name, last_names, email, pass, address } = req.body;
			const data = {
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
				return res.status(409).json({ message: 'Usuario ya existe en la BD' });
			}

			res.status(201).json({
				message: 'Nuevo usuario creado',
				full_name: (`${newUser.name} ${newUser.lastnames}`),
				dni: newUser.dni,
				phone: newUser.phone,
				email: newUser.email
			});
		} catch (error) {
			res.status(500).json({ message: 'Error al listar usuarios', error })
		}
	},

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
			res.status(201).json(resp)

		} catch (error) {
			res.status(500).json({ message: 'Error al listar usuarios', error })
		}
	},

	oneUser: async (req, res) => {
		try {
			// Obtener los datos del cuerpo de la solicitud
			const { login_data } = req.body
			const user = await getOneUser(login_data);

			// Enviar la respuesta combinada
			res.status(201).json({
				message: 'Usuario encontrado',
				username: `${user.username}`,
				full_name: (`${user.first_name} ${user.last_names}`),
				address: user.address,
				email: user.email
			})
		} catch (error) {
			res.status(500).json({ message: 'Error al listar el usuario', error })
		}
	},

	updateUser: async (req, res) => {
		try {
			const { dni, name, lastnames, phone, email } = req.body;
			const newData = {
				name,
				lastnames,
				phone,
				email
			};
			const user = await updateOneUser(dni, newData);
			return res.status(201).json({
				data: user,
				message: "Datos del usuario modificado"
			});
		} catch (error) {
			res.status(500).json({ message: 'Error al actualizar el usuario', error })
		}
	},

	deleteUser: async (req, res) => {
		try {
			const { dni } = req.body;
			const user = await deleteUser(dni);
			return res.status(201).json({
				data: user,
				message: "El usuario ha sido eliminado"
			});

		} catch (error) {
			res.status(500).json({ message: 'Error al eliminar el usuario', error })
		}
	},
	/*
	//KAN-28
	updatePass: async (req, res) => {
		try {
			//Recogemos los datos del request
			const { email } = req.body;

			// Validamos que el email no sea nulo.
			if (!email) {
				return res
					.status(400)
					.json({ message: "El campo email es obligatorio" });
			}

			// Crear un arreglo con los valores para buscar el usuario.
			const values = ["students", "email", email];

			// Llamar a la función getAlumns para verificar si el usuario existe.
			const infoAlum = await crudMysql.getAlumn(values);

			// Si el usuario no existe, devolver un mensaje de error.
			if (infoAlum.length === 0) {
				return res.status(400).json({ message: "Usuario no encontrado" });
			}

			// Si el usuario EXISTE, se genera el token.
			sign({ email }, "secretkey", { expiresIn: "15m" }, (err, token) => {
				if (err) {
					return res
						.status(500)
						.json({ message: "Error al generar el token", error: err });
				}

				// Responder con el token
				return res.status(200).json({
					message:
						"Usuario encontrado. Aquí está el token para cambiar la contraseña.",
					token: `Bearer ${token}`,
				});
			});
		} catch (e) {
			console.log("Error en updatePass: ", e);
			res.status(500).json({ message: "Error en el servidor", error: e });
		}
	},

	/*
		Ticket de Jira: KAN-29 
		Nombre: Rafa 
		Fecha: 22/01/25
		Descripcion: Funcionalidad confirmar nuevo correo funcional
	*/
	/*
	confirmPass: async (req, res) => {

		try {
			verify(req.params.token, 'secretkey', (err, token) => {
				//Si hay un error repondemos con él
				if (err) {
					console.log("Error en validating token: ", err);
					return res
						.status(500)
						.json({ message: "Error al validar el token", error: err });
					//Si es verificado...
				} else {
					//Extraemos el email del payload
					const { email } = token;

					//Actualizamos la base de datos
					const values = ['students', 'pass', req.body.pass, 'email', email];
					crudMysql.updateAlumnValue(values);

					// Enviamos la respuesta exitosa

					console.log("Contraseña actualizada correctamente");
					return res.status(500).json({ message: 'Contraseña actualizada correctamente.' });
				}
			})
		} catch (e) {
			console.log("Error en updatePass: ", e);
			res.status(500).json({ message: "Error en el servidor", error: e });
		}

	}*/
}

// PASS RECOVER