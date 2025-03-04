import { createNewProduct, getAllProducts, getAllProductsByCategory } from '../models/sequelize/product.model.js';
import { getOneCategory } from '../models/sequelize/category.model.js';
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

	newProduct: async (req, res) => {
		try {
			const { category_id, bar_code, product_name, description, buy_price, sell_price, image_url, quantity } = req.body;

            const userId = req.authData?.id;

            if (!userId) {
                return res.status(400).json({ message: 'No se proporcionó el usuario.' });
            }

			const data = {
				user_id: userId,
				category_id: category_id,
				bar_code,
				product_name,
				description,
				buy_price,
				sell_price,
				image_url,
				quantity
			};
			const newProduct = await createNewProduct(data);

			if (!newProduct) {
				return res.status(409).json({ message: 'Producto ya existe en la BD' });
			}

			res.status(201).json({
				message: 'Nuevo producto creado',
				newProduct: newProduct
			});
		} catch (error) {
			res.status(500).json({ message: 'Error al crear producto', error })
		}
	},

	allProductsByCategory: async (req, res) => {
		try {
			const { category_id } = req.params;
			const userId = req.authData ? req.authData.id : null;

			if (!userId) {
                return res.status(400).json({ message: 'No se proporcionó el usuario.' });
            }

			const data = {
				userId,
				category_id
			}

			const products = await getAllProductsByCategory(data);

			const resp = products.map((product, i) => ({
				product: `${i + 1}`,
				category_id: product.category_id,
				bar_code: product.bar_code,
				product_name: product.product_name,
				description: product.description,
				buy_price: product.buy_price,
				sell_price: product.sell_price,
				image_url: product.image_url,
				quantity: product.quantity
			}));

			// Enviar la respuesta combinada
			res.status(201).json(resp)

		} catch (error) {
			res.status(500).json({ message: 'Error al listar productos', error })
		}
	},

	allProducts: async (req, res) => {
		try {
			const userId = req.authData ? req.authData.id : null;

			if (!userId) {
                return res.status(400).json({ message: 'No se proporcionó el usuario.' });
            }

			const products = await getAllProducts(userId);

			const resp = products.map((product, i) => ({
				id: `${i + 1}`,
				category_id: product.category_id,
				bar_code: product.bar_code,
				product_name: product.product_name,
				description: product.description,
				buy_price: product.buy_price,
				sell_price: product.sell_price,
				image_url: product.image_url,
				quantity: product.quantity
			}));

			res.status(200).json({
                message: 'Productos obtenidos correctamente.',
                data: resp,
            });

		} catch (error) {
			res.status(500).json({ message: 'Error al listar productos', error })
		}
	},

	oneProduct: async (req, res) => {
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