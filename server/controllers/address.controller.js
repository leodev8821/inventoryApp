import mongo from '../database/mongo.js';
import { scrapeSpainsTownsAndProvinces } from '../utils/scraping.util.js';
import { createTown, getAllSpainTowns } from '../models/mongoose/spainTowns.model.js';
import { createProvince,getAllSpainProvinces } from '../models/mongoose/spainProvinces.model.js';
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
	},

	getProvinces: async (req, res) => {

		try {

			await mongo.connectToMongo();
			const provinces = await getAllSpainProvinces();

			return res.status(200).json({
				message: `Todas las Provincias han sido recuperadas.`,
				provinces: provinces
			});

		} catch (error) {
			res.status(500).json({
				message: 'Error al obtener las provincias de la base de datos.',
				error: error.message
			});
		}

	},

	getTowns: async (req, res) => {

		try {

			await mongo.connectToMongo();
			const towns = await getAllSpainTowns();

			return res.status(200).json({
				message: `Todas los municipios han sido recuperados.`,
				towns: towns
			});

		} catch (error) {
			res.status(500).json({
				message: 'Error al obtener los municipios de la base de datos.',
				error: error.message
			});
		}

	},

	getAddressType: async (req, res) => {

		try {

			await mongo.connectToMongo();
			const type = await getAllAddressTypes();

			return res.status(200).json({
				message: `Todas los tipos de vía han sido recuperados.`,
				type: type
			});

		} catch (error) {
			res.status(500).json({
				message: 'Error al obtener los municipios de la base de datos.',
				error: error.message
			});
		}

	},

}