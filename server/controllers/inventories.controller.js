import { createNewInventory, getAllInventories, getInventoryById, updateInventory } from '../models/sequelize/inventory.model.js';

/* ------------- FUNCTIONS ----------------*/

export default {

	newInventoryRegister: async (req, res) => {
		try {
			const { product_id, user_id, change } = req.body;

			if (!product_id || !user_id || change === undefined) {
				return res.status(400).json({ error: 'Los campos product_id, user_id y change son requeridos.' });
			}
			const newInventory = await createNewInventory({
				product_id,
				user_id,
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
			// Suponiendo que el id del usuario viene desde la sesión (req.user) o, en su defecto, desde la query
			const userId = req.user ? req.user.id : req.query.user_id;
			if (!userId) {
				return res.status(400).json({ message: 'No se proporcionó el id del usuario.' });
			}
			
			const inventories = await getAllInventories(userId);

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
			// Suponiendo que el id del usuario viene desde la sesión (req.user) o, en su defecto, desde la query
			const userId = req.user ? req.user.id : req.query.user_id;
			if (!userId) {
				return res.status(400).json({ message: 'No se proporcionó el id del usuario.' });
			}
			
			// Llama a la función de servicio para obtener el registro del inventario
			const inventory = await getInventoryById(id, userId);
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
	}
}
