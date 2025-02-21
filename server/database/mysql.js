import { Sequelize } from 'sequelize';
//import { configDotenv } from 'dotenv';
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
//import 'dotenv/config';
import { User } from '../models/user.model.js';
import { Product } from '../models/product.model.js';
import { Inventory } from '../models/inventory.model.js';
import { Category } from '../models/category.model.js';



export function getSequelizeConf() {
	// Obtener la ruta absoluta del directorio del proyecto
	const __dirname = dirname(fileURLToPath(import.meta.url));
	const envPath = join(__dirname, '../../.env'); // Subir un nivel hasta 'project/.env'

	// Cargar el archivo .env manualmente
	dotenv.config({ path: envPath });

	// Configuración de las variables de entorno
	//configDotenv();

	// Usar variables de entorno
	const MY_DB = process.env.MY_DB;
	const MY_USER = process.env.MY_USER;
	const MY_PASS = process.env.MY_PASS;
	const MY_HOST = process.env.MY_HOST;
	const MY_PORT = parseInt(process.env.MY_PORT, 10) || 3306;
	/* const my_db = 'inventory_app_db';
	const my_user = 'leodev';
	const my_pass = 'leodev1721';
	const my_host = 'localhost';
	const my_port = 3306; */
	return new Sequelize(MY_DB, MY_USER, MY_PASS, {
		host: MY_HOST,
		dialect: 'mysql',
		port: MY_PORT,
		logging: false // Desactiva los logs SQL
	});
}

export default {
	connection: async () => {
		const sequelize = getSequelizeConf();
		try {
			await sequelize.authenticate();
			console.log('Conexión establecida correctamente.');

			//await associations.setUpAssociations(); // configura las asociaciones de las tablas

			// Esto crea las tablas si no existen
			await User.sync();
			await Category.sync();
			await Product.sync();
			await Inventory.sync();
			console.log('Modelos sincronizados con la base de datos.');
		} catch (error) {
			console.error('No se pudo conectar a la base de datos:', error);
		}
	}
}