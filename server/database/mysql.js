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

		const MY_SUDO_ROLE = parseInt(process.env.SUDO_ROLE, 10)
		const MY_SUDO_USERNAME = process.env.SUDO_USERNAME;
		const MY_SUDO_F_NAME = process.env.SUDO_FIRST_NAME;
		const MY_SUDO_L_NAME = process.env.SUDO_LAST_NAMES;
		const MY_SUDO_EMAIL = process.env.SUDO_EMAIL;
		const MY_SUDO_PASS = process.env.SUDO_PASS;
		const MY_SUDO_ADDR = process.env.SUDO_ADDRESS;
		const MY_SUDO_REG = process.env.SUDO_IS_REGISTERED;
		const MY_SUDO_VISIBLE = process.env.SUDO_IS_VISIBLE;

		const sequelize = getSequelizeConf();
		try {
			await sequelize.authenticate();
			console.log('✅ MySQL conectado');

			//await associations.setUpAssociations(); // configura las asociaciones de las tablas

			// Esto crea las tablas si no existen
			await Role.sync();
			await User.sync();
			await Category.sync();
			await Product.sync();
			await Inventory.sync();
			console.log('✅ Modelos sincronizados con la base de datos.');

			// Insertar roles si la tabla está vacía
			const roleCount = await Role.count();
			if (roleCount === 0) {
				const rolesToInsert = [
					{ role: 1 },
					{ role: 2 },
					{ role: 3 },
					{ role: 4 }
				];
				await Role.bulkCreate(rolesToInsert);
				console.log('✅ Roles iniciales insertados.');
			} else {
				console.log('⚠️ Los roles ya existen, no se insertaron nuevos registros.');
			}

			//Insertar usuario superUser
			const userCount = await User.count();
			if (userCount === 0) {
				const sudoUser = {
					role_id: MY_SUDO_ROLE,
					username: MY_SUDO_USERNAME,
					first_name: MY_SUDO_F_NAME,
					last_names: MY_SUDO_L_NAME,
					email: MY_SUDO_EMAIL,
					pass: MY_SUDO_PASS,
					address: MY_SUDO_ADDR,
					isRegistered: MY_SUDO_REG,
					isVisible: MY_SUDO_VISIBLE
				};
				await User.create(sudoUser)
				console.log('✅ Superusuario creado');
			} else {
				console.log('⚠️ Superusuario ya existe');
			}
		} catch (error) {
			console.error('❌ Error de conexión a MySQL:', err);
		}
	}
}