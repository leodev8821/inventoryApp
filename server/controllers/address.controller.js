import mongo from '../database/mongo.js';
import { scrapeSpainsTowns } from '../utils/scraping.util.js';
import { createTown } from '../models/mongoose/spainTowns.model.js';

export default {

	/**
	 * Crea todos los municipios en la base de datos MongoDB, obteniendo la información
	 * desde la página del IGN mediante scraping.
	 *
	 * @async
	 * @function createAllTowns
	 * @param {Object} req - Objeto de solicitud de Express.
	 * @param {Object} res - Objeto de respuesta de Express.
	 * @returns {Promise<void>} - Una promesa que resuelve cuando todos los municipios han sido creados en la base de datos.
	 *
	 * @throws {Error} - Lanza un error si ocurre un problema durante el proceso de scraping, la conexión a MongoDB,
	 * o la creación de los municipios en la base de datos.
	*/
	createAllTowns: async (req, res) => {

		try {

			const allTowns = await scrapeSpainsTowns();

			await mongo.connectToMongo();

			console.log("Preparado para insertar datos en MongoBD...");

			for (const town of allTowns) {
				await createTown(town);
			}

			console.log("¡Inserción de los datos a MongoBD finalizada!");

			return res.status(201).json({
				message: `Todos los municipios han sido creados. Total: ${allTowns.length} municipios.`,
				data: allTowns
			});

		} catch (error) {
			res.status(500).json({
				message: 'Error al crear los municipios en la base de datos.',
				error: error.message
			});
		}
	}
}