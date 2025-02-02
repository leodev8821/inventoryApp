import jwt from 'jsonwebtoken';
import query from '../utils/crudMySQL.js';
import serverResponse from '../utils/serverResponse.js';

const resp = serverResponse;
const { sign } = jwt;

/* ------------- FUNCTIONS ----------------*/

export default {
	loginUser: async (req, res) => {
		try {
			const { loginData, password } = req.body;
			const user = await query.getOneUser(loginData);

			//verificar usuario
			if (!user) {
				return res.status(404).json({ error: 'Usuario no encontrado.' });
			}

			//Verificar contraseña
			if (user.dataValues.pass != password) {
				return res.status(401).json({ error: 'Credenciales incorrectas' });
			}

			//Generar token de autenticación
			sign(user.dataValues, 'secretkey', { expiresIn: '1000s' }, (err, token) => {
				if (err) {
					return res.status(500).json({ error: 'Error al generar el token' });
				}
				res.status(200).json(resp.tokenGen(user.dataValues, token));
			})

		} catch (error) {
			res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
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
			const newUser = await query.createNewUser(dni, data);

			if(!newUser){
				return res.status(501).json({ message: 'Usuario ya existe'});
			}

			res.status(201).json(resp.user(newUser, 'Nuevo estudiante creado'));
		} catch (error) {
			res.status(500).json({ message: 'Error al listar usuarios', error })
		}
	},

	allUsers: async (req, res) => {
		try {	
			const users = await query.getAllUsers();
			// Enviar la respuesta combinada
			res.status(201).json(resp.user(users.dataValues, "Usuarios encontrados"))

		} catch (error) {
			res.status(500).json({ message: 'Error al listar usuarios', error })
		}
	},

	oneUser: async (req, res) => {
		try {
			// Obtener los datos del cuerpo de la solicitud
			const { logData } = req.body
			const user = await query.getOneUser(logData);
			// Enviar la respuesta combinada
			res.status(201).json(resp.user(user.dataValues, "Usuario encontrado"))
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
			const user = await query.updateOneUser(dni, newData);
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
			const user = await query.deleteUser(dni);
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