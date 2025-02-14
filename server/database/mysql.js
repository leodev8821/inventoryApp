import { Sequelize } from 'sequelize';
import { User } from '../models/user.model.js';
import { Product } from '../models/product.model.js';
import { Inventory } from '../models/inventory.model.js';
import { Category } from '../models/category.model.js';
//import associations from '../models/associations.js';

export function getSequelizeConf() {
	const my_db = 'inventoryApp';
	const my_user = 'root';
	//const my_pass = 'leodev1721';
	const my_pass = 'root';
	const my_host = 'localhost';
	const my_port = 3306;
	return new Sequelize(my_db, my_user, my_pass, {
		host: my_host,
		dialect: 'mysql',
		port: my_port,
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