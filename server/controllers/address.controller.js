import { scrapeSpainsTownsAndProvinces } from '../utils/scraping.util.js';
import { createTown, getAllSpainTowns } from '../models/mongoose/spainTowns.model.js';
import { getAllAddressTypes } from '../models/mongoose/addressType.model.js';

export default {

	/**
	 * Crea todos los municipios y provincias en la base de datos MongoDB, obteniendo la información
	 * desde la página del IGN mediante scraping.
	 *
	 * @async
	 * @function createAllTownsAndProvinces
	 * @param {Object} req - Objeto de solicitud de Express.
	 * @param {Object} res - Objeto de respuesta de Express.
	 * @returns {Promise<void>} - Una promesa que resuelve cuando todos los municipios y provincias han sido creados en la base de datos.
	 *
	 * @throws {Error} - Lanza un error si ocurre un problema durante el proceso de scraping, la conexión a MongoDB,
	 * o la creación de los municipios o provincias en la base de datos.
	*/
	createAllTownsAndProvinces: async (req, res) => {

		try {

			const { towns } = await scrapeSpainsTownsAndProvinces();

			for (const town of towns) {
				await createTown(town);
			}

			console.log("✅ ¡Inserción de pueblos y provincias a MongoBD finalizada!");

			return res.status(201).json({
				ok: true,
				message: `Todos los municipios han sido creados.`,
				towns: towns.length
			});

		} catch (error) {
			res.status(500).json({
				ok: false,
				message: 'Error al crear los municipios en la base de datos.',
				error: error.message
			});
		}
	},

	getAddressData: async (req, res) => {
		try {
			let provinces = [];
			let uniqueProvinces = new Set(); // Usamos un Set para asegurar provincias únicas fácilmente

			// Obtener todos los pueblos y tipos de vía
			const towns = await getAllSpainTowns();
			const types = await getAllAddressTypes();

			// Extraer provincias únicas
			towns.forEach(town => {
				if (town.province && !uniqueProvinces.has(town.province)) {
					uniqueProvinces.add(town.province);
					provinces.push(town.province);
				}
			});

			return res.status(200).json({
				ok: true,
				message: `Todas los pueblos y tipos de vía han sido recuperados.`,
				provinces,
				towns,
				types
			});

		} catch (error) {
			res.status(500).json({
				ok: false,
				message: 'Error al obtener los pueblos y tipos de vía de la base de datos.',
				error: error.message
			});
		}
	},
}