import { createNewProduct, getAllProducts, getAllProductsByCategory, updateOneProduct, deleteProduct, getOneProduct } from '../models/sequelize/product.model.js';
import { getOneCategory } from '../models/sequelize/category.model.js';
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { ok } from 'assert';

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
			const { category_id, bar_code, product_name, description, buy_price, sell_price, image_url } = req.body;

			const data = {
				category_id: category_id,
				bar_code,
				product_name,
				description,
				buy_price,
				sell_price,
				image_url
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

			const products = await getAllProductsByCategory(category_id);

			const resp = products.map((product, i) => ({
				product: `${i + 1}`,
				category_id: product.category_id,
				bar_code: product.bar_code,
				product_name: product.product_name,
				description: product.description,
				buy_price: product.buy_price,
				sell_price: product.sell_price,
				image_url: product.image_url
			}));

			// Enviar la respuesta combinada
			res.status(201).json(resp)

		} catch (error) {
			res.status(500).json({ message: 'Error al listar productos', error })
		}
	},

	allProducts: async (req, res) => {
		try {
			const products = await getAllProducts();

			const resp = products.map((product, i) => ({
				id: `${i + 1}`,
				category_id: product.category_id,
				bar_code: product.bar_code,
				product_name: product.product_name,
				description: product.description,
				buy_price: product.buy_price,
				sell_price: product.sell_price,
				image_url: product.image_url
			}));

			res.status(200).json({
				message: 'Productos obtenidos correctamente.',
				data: resp,
			});

		} catch (error) {
			res.status(500).json({ message: 'Error al listar productos', error })
		}
	},

	updateProduct: async (req, res) => {
		try {
			const { product_id } = req.params;
			const { category_id, bar_code, product_name, description, buy_price, sell_price, image_url } = req.body;

			const newData = {
				category_id,
				bar_code,
				product_name,
				description,
				buy_price,
				sell_price,
				image_url
			};

			const existing = await getOneProduct(bar_code);

			if(existing){
				return res.status(409).json({
					ok: false,
					message: 'Código de Barras ya está en uso' 
				});
			}


			const modifiedProduct = await updateOneProduct(product_id, newData);

			if (!modifiedProduct) {
				return res.status(404).json({
					ok: false,
					message: "Producto no encontrado"
				});
			}

			return res.status(200).json({
				ok: true,
				message: "Producto modificado correctamente",
				data: modifiedProduct,
			});
		} catch (error) {
			res.status(500).json({ message: 'Error al actualizar el producto', error })
		}
	},

	deleteProduct: async (req, res) => {
		try {
			const { product_id } = req.params;
			const existingProduct = await getProductById(product_id);

			if (!existingProduct) {
				return res.status(404).json({
					ok: false,
					message: "Producto no encontrado"
				});
			}

			return res.status(200).json({
				ok: true,
				message: "El producto ha sido eliminado"
			});

		} catch (error) {
			res.status(500).json({ message: 'Error al eliminar el producto', error })
		}
	},
	/*
		oneProduct: async (req, res) => {
			try {
				// Obtener los datos del cuerpo de la solicitud
				const { login_data } = req.body
				const product = await getOneproduct(login_data);
	
				// Enviar la respuesta combinada
				res.status(201).json({
					message: 'producto encontrado',
					productname: `${product.productname}`,
					full_name: (`${product.first_name} ${product.last_names}`),
					address: product.address,
					email: product.email
				})
			} catch (error) {
				res.status(500).json({ message: 'Error al listar el producto', error })
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
	
				// Crear un arreglo con los valores para buscar el producto.
				const values = ["students", "email", email];
	
				// Llamar a la función getAlumns para verificar si el producto existe.
				const infoAlum = await crudMysql.getAlumn(values);
	
				// Si el producto no existe, devolver un mensaje de error.
				if (infoAlum.length === 0) {
					return res.status(400).json({ message: "producto no encontrado" });
				}
	
				// Si el producto EXISTE, se genera el token.
				sign({ email }, "secretkey", { expiresIn: "15m" }, (err, token) => {
					if (err) {
						return res
							.status(500)
							.json({ message: "Error al generar el token", error: err });
					}
	
					// Responder con el token
					return res.status(200).json({
						message:
							"producto encontrado. Aquí está el token para cambiar la contraseña.",
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