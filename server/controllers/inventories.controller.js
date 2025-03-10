import { createNewInventory, getAllInventories, getInventoryById, updateInventory } from '../models/sequelize/inventory.model.js';
import { getOneProduct } from '../models/sequelize/product.model.js';

/* ------------- FUNCTIONS ----------------*/

export default {

	newRegister: async (req, res) => {
		try {
			/*
			id: Int
			product_id: Int
			quantity: Int
			value: decimal
			isVisible: bool*/
			const product_id = req.params;
			const { quantity, isVisible } = req.body;

			if (!product_id || quantity === undefined || isVisible === undefined) {
				return res.status(400).json({ error: 'Los campos Cantidad y Visibilidad son requeridos.' });
			}

			const product = await getOneProduct(product_id);
			
			if (!product) {
				return res.status(404).json({ error: 'No se encuentra el producto' });
			}

			const value = quantity * product.buy_price;

			const newInventory = await createNewInventory({
				product_id,
				quantity,
				value,
				isVisible: true
			});

			res.status(201).json({
				message: 'Nuevo registro de inventario creado',
				newInventory
			});
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: 'Error al crear el registro de inventario.' });
		}
	},

	allInventoryRegisters: async (req, res) => {
		try {			
			/*
			id: Int
			product_id: Int
			quantity: Int
			value: decimal
			isVisible: bool*/
			const inventories = await getAllInventories();

			if (!inventories) {
				return res.status(404).json({ message: 'Registros de inventarios no encontrados' });
			}
			
			// Formatea la respuesta
			const resp = {
				inventory: inventories.id,
				product: inventories.product_id,
				quantity: inventories.quantity,
				value: inventories.value,
				isVisible: inventories.isVisible
			};
			
			res.status(200).json(resp);
		} catch (error) {
			console.error('Error al obtener los registros de inventarios:', error);
			res.status(500).json({ message: 'Error al obtener los registros de inventarios', error });
		}
	},

	/**TODO */
	updateQuantity: async (req, res) => {
		try {
			/*
			id: Int
			product_id: Int
			quantity: Int
			value: decimal
			isVisible: bool*/
			const product_id = req.params;
			const { quantity, isVisible } = req.body;

			const product = await getOneProduct(product_id);
						
			// Llama a la función de servicio para obtener el registro del inventario
			const inventory = await getInventoryById(id);
			if (!inventory) {
				return res.status(404).json({ message: 'Registro de inventario no encontrado o no pertenece al usuario.' });
			}
			
			// Formatea la respuesta
			const resp = {
				inventory: inventory.id,
				user: inventory.user_id,
				product: inventory.product_id,
				change: inventory.change,
				created: inventory.createdAt
			};
			
			res.status(200).json(resp);
		} catch (error) {
			console.error('Error al obtener el registro de inventario:', error);
			res.status(500).json({ message: 'Error al obtener el registro de inventario', error });
		}
	}
}
