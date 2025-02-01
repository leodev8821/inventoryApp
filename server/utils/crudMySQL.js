import { Op } from 'sequelize';
import model from '../models/user.model.js';
import mysqlConnection from '../database/mysql.connection.js';

const conectiondb = mysqlConnection.connection();

const userModel = await model.userModel();

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
			const user = await userModel.findOne({
				where: {
					[Op.or]: [
						{ username: userInfo },
						{ email: userInfo }
					]
				}
			});
			if (user) {
				console.error("Usuario ya existe en la BD");
				return null;
			}

			const newUser = await userModel.create(data);
			console.log('Estudiante creado:', newUser.toJSON());
			return newUser;

		} catch (error) {
			console.error('Error al crear estudiante:', error);
		}
	},

	/**
	 * Read (all students)
	 * @returns -> listado de estudiantes
	 */
	getAllUsers: async () => {
		try {
			const users = await userModel.findAll();
			//console.log('Todos los usuarios:', JSON.stringify(students));
			return users;
		} catch (error) {
			console.error('Error al obtener usuarios:', error);
			throw new Error('Error al consultar la base de datos.');
		}
	},

	/**
	 * Buscar un estudiante por username o email
	 * @param userInfo -> username o email + password
	 * @returns user -> usuario encontrado
	 */
	getOneUser: async (userInfo) => {
		try {
			const user = await userModel.findOne({
				where: {
					[Op.and]: [
						{ isVisible: 1 }
					],
					[Op.or]: [
						{ username: userInfo },
						{ email: userInfo }
					]
				}
			});

			if (!user) {
				console.log(`Usuario con username o email "${userInfo}" no encontrado.`);
				return null;
			}

			//console.log('Usuario encontrado:', student.toJSON());
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
			const user = await userModel.findOne({
				where: {
					[Op.or]: [
						{ username: userInfo },
						{ email: userInfo }
					]
				}
			});
			if (!user) {
				console.log('Usuario no encontrado');
				throw new Error('Usuario no encontrado');
			}

			await userModel.update(newData);
			console.log('Usuario actualizado:', user.toJSON());
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
			const user = await userModel.findOne({
				where: {
					[Op.or]: [
						{ username: userInfo },
						{ email: userInfo }
					]
				}
			});
			if (!user) {
				console.log('Estudiante no encontrado');
				throw new Error('Usuario no encontrado');

			}

			await userModel.update({ isVisible: 0 });
			console.log('Estudiante eliminado:', user.toJSON());
			return user;
		} catch (error) {
			console.error('Error al eliminar el estudiante:', error);
			throw new Error('Error al eliminar el estudiante');
		}
	}

}