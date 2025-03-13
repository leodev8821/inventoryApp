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
				return res.status(409).json({
					ok:false,
					message: 'Producto ya existe en la BD' 
				});
			}

			res.status(201).json({
				ok: true,
				message: 'Nuevo producto creado',
				data: newProduct
			});
		} catch (error) {
			res.status(500).json({
				ok:false,
				message: 'Error al crear producto', 
				error: error.message
			})
		}
	},

	getOneProductByID: async (req, res) => {
		try {
			const { product_id } = req.params;

			const product = await getOneProduct(product_id);

			if (!product) {
				return res.status(404).json({
					ok: false,
					message: "Producto no encontrado"
				});
			}

			res.status(200).json({
				ok: true,
				message: 'Producto encontrado',
				data: product
			});

		} catch (error) {
			res.status(500).json({
				ok:false,
				message: 'Error al listar productos', 
				error: error.message
			})
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
			res.status(201).json({
				ok: true,
				message: 'Productos obtenidos correctamente',
				data: resp
			});

		} catch (error) {
			res.status(500).json({
				ok:false,
				message: 'Error al listar productos', 
				error: error.message
			})
		}
	},

	allProducts: async (req, res) => {
		try {
			const products = await getAllProducts();

			const resp = products.map((product) => ({
				id: product.id,
				category_id: product.category_id,
				bar_code: product.bar_code,
				product_name: product.product_name,
				description: product.description,
				buy_price: product.buy_price,
				sell_price: product.sell_price,
				image_url: product.image_url
			}));

			res.status(200).json({
				ok: true,
				message: 'Productos obtenidos correctamente.',
				data: resp,
			});

		} catch (error) {
			res.status(500).json({
				ok:false,
				message: 'Error al listar productos', 
				error: error.message
			})
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
			res.status(500).json({
				ok:false,
				message: 'Error al actualizar el producto', 
				error: error.message
			})
		}
	},

	deleteProduct: async (req, res) => {
		try {
			const { product_id } = req.params;
			const existingProduct = await getOneProduct(product_id);


			if (!existingProduct) {
				return res.status(404).json({
					ok: false,
					message: "Producto no encontrado"
				});
			}

			await deleteProduct(product_id)

			return res.status(200).json({
				ok: true,
				message: "El producto ha sido eliminado"
			});

		} catch (error) {
			res.status(500).json({
				ok:false,
				message: 'Error al eliminar el producto', 
				error: error.message
			})
		}
	},
}