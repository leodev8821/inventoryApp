import { Sequelize } from 'sequelize';
import userModel from '../models/user.model.js';
import productModel from '../models/product.model.js';
import inventoryModel from '../models/inventory.model.js';
import categoryModel from '../models/category.model.js';
import confg from '../models/associations.js';

export function getSequelizeConf() {
	const sequelize = new Sequelize('inventoryAppDB', 'root', 'root', {
		host: "localhost",
		dialect: 'mysql',
		port: 3306,
		logging: false // Desactiva los logs SQL
	});
	return sequelize;
}

export default {

	connection: async () => {
		const sequelize = getSequelizeConf();
		const user = await userModel.userModel();
		const product = await productModel.productModel();
		const category = await categoryModel.categoryModel();
		const inventory = await inventoryModel.inventoryModel();
		try {
			await sequelize.authenticate();
			console.log('Conexión establecida correctamente.');
			await confg.setUpAssociations(); // configura las asociaciones de las tablas
			// Esto crea las tablas si no existen
			await user.sync();
			await category.sync()
			await product.sync();
			await inventory.sync();
			console.log('Modelos sincronizados con la base de datos.');
		} catch (error) {
			console.error('No se pudo conectar a la base de datos:', error);
		}
	}
}