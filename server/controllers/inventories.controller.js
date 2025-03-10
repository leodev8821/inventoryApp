import { createNewInventory, getAllInventories, getInventoryById, updateInventory } from '../models/sequelize/inventory.model.js';

/* ------------- FUNCTIONS ----------------*/

export default {

	newInventoryRegister: async (req, res) => {
		try {
			const { product_id, change } = req.body;

			if (!product_id || change === undefined) {
				return res.status(400).json({ error: 'Los campos product_id y change son requeridos.' });
			}
			const newInventory = await createNewInventory({
				product_id,
				change,
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
			const inventories = await getAllInventories();

			if (!inventories) {
				return res.status(404).json({ message: 'Registros de inventarios no encontrados o no pertenecen al usuario.' });
			}
			
			// Formatea la respuesta
			const resp = {
				inventory: inventories.id,
				user: inventories.user_id,
				product: inventories.product_id,
				change: inventories.change,
				created: inventories.createdAt
			};
			
			res.status(200).json(resp);
		} catch (error) {
			console.error('Error al obtener los registros de inventarios:', error);
			res.status(500).json({ message: 'Error al obtener los registros de inventarios', error });
		}
	},

	oneProduct: async (req, res) => {
		try {
			// Extrae el id del registro de inventario desde la URL
			const { id } = req.params;
						
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
