import { createNewInventory, getAllInventories, getInventoryByProductId, updateInventory } from '../models/sequelize/inventory.model.js';
import { getOneProduct } from '../models/sequelize/product.model.js';

/* ------------- FUNCTIONS ----------------*/

export default {

	newRegister: async (req, res) => {
		try {
			const product_id = req.params;
			const { quantity, isVisible } = req.body;

			if (!product_id || quantity === undefined || isVisible === undefined) {
				return res.status(400).json({
					ok: false,
					message: 'Los campos Cantidad y Visibilidad son requeridos.'
				});
			}

			const product = await getOneProduct(product_id);
			
			if (!product) {
				return res.status(404).json({
					ok: false,
					message: 'No se encuentra el producto',
				});
			}

			const value = quantity * product.buy_price;

			const newInventory = await createNewInventory({
				product_id,
				quantity,
				value,
				isVisible: true
			});

			res.status(201).json({
				ok: true,
				message: 'Nuevo registro de inventario creado',
				data: newInventory
			});
		} catch (error) {
			console.error(error);
			return res.status(500).json({
				ok: false,
				message: "Error al crear el registro de inventario.",
				error: error.message 
			});
		}
	},

	allInventoryRegisters: async (req, res) => {
		try {
			const inventories = await getAllInventories();

			if (!inventories) {
				return res.status(404).json({
					ok: false,
					message: 'Registros de inventarios no encontrados'
				});
			}
			
			// Formatea la respuesta
			const resp = {
				inventory: inventories.id,
				product: inventories.product_id,
				quantity: inventories.quantity,
				value: inventories.value,
				isVisible: inventories.isVisible
			};
			
			res.status(200).json({
				ok: true,
				message: 'Registros de inventarios encontrados',
				data: resp
			});
		} catch (error) {
			console.error('Error al obtener los registros de inventarios:', error);
			res.status(500).json({
				ok: false,
				message: 'Error al obtener los registros de inventarios', 
				error: error.message
			});
		}
	},

	updateRegisterQuantity: async (req, res) => {
		try {
			const product_id = req.params;
			const { quantity } = req.body;
						
			// Llama a la función de servicio para obtener el registro del inventario
			const inventory = await getInventoryByProductId(product_id);
			if (!inventory) {
				return res.status(404).json({ 
					ok: false,
					message: 'Registro de inventario no encontrado o no pertenece al usuario.' 
				});
			}

			const newQuantity = await updateInventory(product_id, quantity)
			
			// Formatea la respuesta
			const modifiedRegister = {
				id: newQuantity.id,
				product_id: newQuantity.product_id,
				quantity: newQuantity.quantity,
				value: newQuantity.value,
				isVisible: newQuantity.isVisible
			};
			
			res.status(200).json({
				ok: true,
				message: "Producto modificado",
				data: modifiedRegister
			});
		} catch (error) {
			console.error('Error al obtener el registro de inventario:', error);
			res.status(500).json({
				ok: false,
				message: 'Error al obtener el registro de inventario',
				error: error.message 
			});
		}
	},

	deleteRegister: async (req, res) => {
		try {
			const product_id = req.params;
						
			// Llama a la función para obtener el registro del inventario
			const inventory = await getInventoryByProductId(product_id);
			if (!inventory) {
				return res.status(404).json({ 
					ok: false,
					message: 'Registro de inventario no encontrado o no pertenece al usuario.' 
				});
			}

			const deletedRegister = await updateInventory(product_id, { "isVisible":false})
			
			// Formatea la respuesta
			const modifiedRgister = {
				id: deletedRegister.id,
				product_id: deletedRegister.product_id,
				quantity: deletedRegister.quantity,
				value: deletedRegister.value,
				isVisible: deletedRegister.isVisible
			};
			
			res.status(200).json({
				ok: true,
				message: "Registro eliminado",
				data: modifiedRgister
			});
		} catch (error) {
			console.error('Error al obtener el registro de inventario:', error);
			res.status(500).json({
				ok: false,
				message: 'Error al obtener el registro de inventario',
				error: error.message
			});
		}
	}
}
