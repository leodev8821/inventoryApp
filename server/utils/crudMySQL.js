import { Op } from 'sequelize';
import User from '../models/user.model.js';
import mysqlConnection from '../database/mysql.connection.js';

await mysqlConnection.connection();

/* --------- CRUD -----------*/
export default {
	/**
	 * Create a new user
	 * @param {*} userInfo -> New user username or email
	 * @param {*} data -> new user data
	 * @returns newUser -> New user created
	 */
	createNewUser: async (userInfo, data) => {
		try {
			const user = await User.findOne({
				where: {
					[Op.or]: userInfo.map((field) => ({ [field]: data[field] }))
				}
			});
			if (user) {
				console.error(`Usuario con ${userInfo} "${data[userInfo]}" ya existe.`);
				return null;
			}

			const newUser = await User.create(data);
			console.log(`¡Usuario ${userInfo} creado!`, newUser.toJSON());
			return newUser;

		} catch (error) {
			console.error('Error al crear Usuario:', error);
		}
	},

	/**
	 * Read (all students)
	 * @returns -> listado de Usuarios
	 */
	getAllUsers: async () => {
		try {
			await User.findAll();
		} catch (error) {
			console.error('Error al obtener usuarios:', error);
			throw new Error('Error al consultar la base de datos.');
		}
	},

	/**
	 * Buscar un Usuario por username o email
	 * @param userInfo -> username o email + password
	 * @returns user -> usuario encontrado
	 */
	getOneUser: async (userInfo) => {
		try {
			const user = await User.findOne({
				where: {
					[Op.and]: [
						{ isVisible: 1 }
					],
					[Op.or]: userInfo.map((field) => ({ [field]: data[field] }))
				}
			});

			if (!user) {
				console.log(`Usuario con username o email "${userInfo}" no encontrado.`);
				return null;
			}
			return user;

		} catch (error) {
			console.error(`Error al buscar usuario con username o email "${userInfo}":`, error.message);
			throw new Error('Error al consultar la base de datos.');
		}
	},

	/**
	 * Update one user
	 * @param {String} userInfo -> username or email
	 * @param  newData -> data to be update
	 * @returns  user -> User updated
	 */
	updateOneUser: async (userInfo, newData) => {
		try {
			const user = await User.findOne({
				where: {
					[Op.or]: userInfo.map((field) => ({ [field]: data[field] }))
				}
			});

			if (!user) {
				console.log('Usuario no encontrado');
				throw new Error('Usuario no encontrado');
			}

			await User.update(newData, {
				where: {
					[Op.or]: userInfo.map((field) => ({ [field]: data[field] }))
				}
			});

			console.log(`Usuario ${userInfo} actualizado`, user.toJSON());
			return user;
		} catch (error) {
			console.error('Error al actualizar usuario:', error);
			throw new Error('Error al actualizar usuario');
		}
	},

	/**
	 * Delete (set isVisible = 0) an user
	 * @param {*} userInfo -> username or email from user
	 * @returns  user -> user modified (deleted)
	 */
	deleteUser: async (userInfo) => {
		try {
			const user = await User.findOne({
				where: {
					[Op.or]: userInfo.map((field) => ({ [field]: data[field] }))
				}
			});
			if (!user) {
				console.log('Usuario no encontrado');
				throw new Error('Usuario no encontrado');

			}

			user.isVisible = false;
			await user.save();
			console.log(`¡Usuario ${userInfo} eliminado!`, user.toJSON());
			return user;
		} catch (error) {
			console.error(`Error al eliminar el usuario ${userInfo}`, error);
			throw new Error('Error al eliminar el Usuario');
		}
	}

}