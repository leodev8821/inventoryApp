import mongo from '../database/mongo.js';
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

			/*{
            towns: allTowns,
            provinces: provinces
        	}*/

			const { towns } = await scrapeSpainsTownsAndProvinces();

			//await mongo.connectToMongo();

			console.log("Preparado para insertar datos de municipios en MongoBD...");

			for (const town of towns) {
				await createTown(town);
			}

			console.log("¡Inserción de los datos a MongoBD finalizada!");

			return res.status(201).json({
				message: `Todos los municipios han sido creados.`,
				towns: towns.length
			});

		} catch (error) {
			res.status(500).json({
				message: 'Error al crear los municipios en la base de datos.',
				error: error.message
			});
		}
	},

	getAddressData: async (req, res) => {
		try{
			//await mongo.connectToMongo();

			console.log('Recuperando todos los pueblos...');
			const towns = await getAllSpainTowns();

			console.log('Recuperando los tipos de vías...');
			const types = await getAllAddressTypes();

			return res.status(200).json({
				message: `Todas los pueblos y tipos de vía han sido recuperados.`,
				towns: towns,
				types: types
			});

		} catch (error) {
			res.status(500).json({
				message: 'Error al obtener los pueblos y tipos de vía de la base de datos.',
				error: error.message
			});
		}

	},

}