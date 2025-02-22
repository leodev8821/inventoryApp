import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { User } from '../models/sequelize/user.model.js';
import { Product } from '../models/sequelize/product.model.js';
import { Inventory } from '../models/sequelize/inventory.model.js';
import { Category } from '../models/sequelize/category.model.js';



export function getSequelizeConf() {
	// Obtener la ruta absoluta del directorio del proyecto
	const __dirname = dirname(fileURLToPath(import.meta.url));
	const envPath = join(__dirname, '../../.env'); // Subir un nivel hasta 'project/.env'

	// Cargar el archivo .env manualmente
	dotenv.config({ path: envPath });

	// Configuración de las variables de entorno desde la misma carpeta raíz del proyecto
	//import { configDotenv } from 'dotenv';
	//configDotenv();

	// Usar variables de entorno
	const MY_DB = process.env.MYSQL_DB;
	const MY_USER = process.env.MYSQL_USER;
	const MY_PASS = process.env.MYSQL_PASS;
	const MY_HOST = process.env.MYSQL_HOST;
	const MY_PORT = parseInt(process.env.MYSQL_PORT, 10) || 3306;

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