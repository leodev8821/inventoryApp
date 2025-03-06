import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { User } from '../models/sequelize/user.model.js';
import { Product } from '../models/sequelize/product.model.js';
import { Inventory } from '../models/sequelize/inventory.model.js';
import { Category } from '../models/sequelize/category.model.js';
import { Role } from '../models/sequelize/role.model.js';



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
		// Obtener la ruta absoluta del directorio del proyecto
		const __dirname = dirname(fileURLToPath(import.meta.url));
		const envPath = join(__dirname, '../../.env'); // Subir un nivel hasta 'project/.env'

		// Cargar el archivo .env manualmente
		dotenv.config({ path: envPath });

		const MY_ADMIN_ROLE = parseInt(process.env.ADMIN_ROLE, 10)
		const MY_ADMIN_USERNAME = process.env.ADMIN_USERNAME;
		const MY_ADMIN_F_NAME = process.env.ADMIN_FIRST_NAME;
		const MY_ADMIN_L_NAME = process.env.ADMIN_LAST_NAMES;
		const MY_ADMIN_EMAIL = process.env.ADMIN_EMAIL;
		const MY_ADMIN_PASS = process.env.ADMIN_PASS;
		const MY_ADMIN_ADDR = process.env.ADMIN_ADDRESS;
		const MY_ADMIN_REG = process.env.ADMIN_IS_REGISTERED;
		const MY_ADMIN_VISIBLE = process.env.ADMIN_IS_VISIBLE;

		const sequelize = getSequelizeConf();
		try {
			await sequelize.authenticate();
			console.log('Conexión establecida correctamente.');

			//await associations.setUpAssociations(); // configura las asociaciones de las tablas

			// Esto crea las tablas si no existen
			await Role.sync();
			await User.sync();
			await Category.sync();
			await Product.sync();
			await Inventory.sync();
			console.log('Modelos sincronizados con la base de datos.');

			// Insertar roles si la tabla está vacía
			const roleCount = await Role.count();
			if (roleCount === 0) {
				const rolesToInsert = [
					{ role: 0 },
					{ role: 1 },
					{ role: 2 },
					{ role: 3 }
				];
				await Role.bulkCreate(rolesToInsert);
				console.log('Roles iniciales insertados.');
			} else {
				console.log('Los roles ya existen, no se insertaron nuevos registros.');
			}

			//Insertar usuario admin
			const userCount = await User.count();
			if (userCount === 0) {
				const adminUser = {
					role_id: MY_ADMIN_ROLE,
					username: MY_ADMIN_USERNAME,
					first_name: MY_ADMIN_F_NAME,
					last_names: MY_ADMIN_L_NAME,
					email: MY_ADMIN_EMAIL,
					pass: MY_ADMIN_PASS,
					address: MY_ADMIN_ADDR,
					isRegistered: MY_ADMIN_REG,
					isVisible: MY_ADMIN_VISIBLE
				};
				await User.create(adminUser)
			} else {
				console.log('Admin ya esta creado');
			}
		} catch (error) {
			console.error('No se pudo conectar a la base de datos:', error);
		}
	}
}