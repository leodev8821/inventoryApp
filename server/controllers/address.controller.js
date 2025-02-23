import mongo from '../database/mongo.js';
import { scrapeSpainsTownsAndProvinces } from '../utils/scraping.util.js';
import { createTown } from '../models/mongoose/spainTowns.model.js';
import { createProvince } from '../models/mongoose/spainProvinces.model.js';

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
	createAllTownsAndProvinces: async (req, res) => {

		try {

			/*{
            towns: allTowns,
            provinces: provinces
        	}*/

			const { towns, provinces } = await scrapeSpainsTownsAndProvinces();

			await mongo.connectToMongo();

			console.log("Preparado para insertar datos de municipios en MongoBD...");

			for (const town of towns) {
				await createTown(town);
			}

			console.log("Preparado para insertar datos de provincias en MongoBD...");

			for (const province of provinces) {
				await createProvince(province);
			}

			console.log("¡Inserción de los datos a MongoBD finalizada!");

			return res.status(201).json({
				message: `Todos los municipios han sido creados.`,
				towns: towns.length,
				provinces: provinces.length
			});

		} catch (error) {
			res.status(500).json({
				message: 'Error al crear los municipios en la base de datos.',
				error: error.message
			});
		}
	}
}