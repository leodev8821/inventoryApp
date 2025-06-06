/** 
 * @author          Leonardo Caicedo, aka Leodev
 * @fileoverview    Módulo que define y gestiona el modelo de Usuario.
 * @module          user.model
 */
import { DataTypes, Op } from 'sequelize';
import bcrypt from 'bcryptjs';
import { getSequelizeConf } from '../../database/mysql.js';
import { Role } from './role.model.js';

/**
 * Conexión a la base de datos.
 */
const connection = getSequelizeConf();

/**
 * Atributos del modelo Usuario.
 * @typedef {object} UserAttributes
 * @property {number} id - ID único del usuario.
 * @property {number} role_id - ID del rol del usuario.
 * @property {string} username - Nombre de usuario.
 * @property {string} first_name - Nombre del usuario.
 * @property {string} last_names - Apellidos del usuario.
 * @property {string} email - Correo electrónico del usuario.
 * @property {string} pass - Contraseña del usuario (hasheada).
 * @property {string} address - Dirección del usuario.
 * @property {boolean} isRegistered - Indica si el usuario está registrado.
 * @property {boolean} isVisible - Indica si el usuario es visible.
 */
export const User = connection.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'roles',
            key: 'id'       
        }
    },
    username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    first_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    last_names: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    pass: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    isRegistered: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    isVisible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
}, {
    tableName: 'users',
    timestamps: false,
    hooks: {
        beforeValidate: async (user) => { // Hook beforeValidate que se ejecuta antes de validar el modelo
            if (user.changed('pass')) { // Verifica si el campo 'pass' ha sido modificado
                const saltRounds = 10; // Número de rondas de hashing
                const hashedPassword = await bcrypt.hash(user.pass, saltRounds); // Hashea la contraseña de forma asíncrona
                user.pass = hashedPassword; // Reemplaza la contraseña en texto plano con el hash
            }
        }
    }
});

/**
 * Relación: Una Usuario pertenece a un rol.
 *
 * @description Establece la relación "belongsTo" entre Role y User, usando 'role_id' como clave foránea.
 * @see {@link User}
 */
User.belongsTo(Role, { foreignKey: 'role_id' });

/**
 * Relación: Un rol tiene muchos usuarios.
 *
 * @description Establece la relación "hasMany" entre User y Role, usando 'role_id' como clave foránea.
 * @see {@link Role}
 */
Role.hasMany(User, { foreignKey: 'role_id', onDelete: 'CASCADE' });

/**
 * Crea un nuevo usuario.
 *
 * @async
 * @function createNewUser
 * @param {object} data - Datos del nuevo usuario.
 * @returns {Promise<UserAttributes|null>} - El nuevo usuario creado o null si ya existe.
 * @throws {Error} - Lanza un error si hay un problema al crear el usuario.
 */
export async function createNewUser(data) {
    try {
        const loginData = ["username", "email"];
        const user = await User.findOne({
            where: {
                [Op.or]: loginData.map((field) => ({ [field]: data[field] }))
            }
        });
        if (user) {
            return null;
        }
        const newUser = await User.create(data);
        return newUser.dataValues;
    } catch (error) {
        console.error('Error al crear Usuario:', error.message);
        throw new Error(`Error al crear Usuario: ${error.message}`);
    }
};

/**
 * Obtiene todos los usuarios.
 *
 * @async
 * @function getAllUsers
 * @returns {Promise<UserAttributes[]>} - Lista de todos los usuarios.
 * @throws {Error} - Lanza un error si hay un problema al consultar la base de datos.
 */
export async function getAllUsers() {
    try {
        return await User.findAll({raw: true});
    } catch (error) {
        console.error('Error al consultar la base de datos: ', error.message);
        throw new Error(`Error al consultar la base de datos: ${error.message}`);
    }
};

/**
 * Obtiene un usuario por ID, nombre de usuario o correo electrónico.
 *
 * @async
 * @function getOneUser
 * @param {string|number} data - ID, nombre de usuario o correo electrónico del usuario.
 * @returns {Promise<UserAttributes|null>} - El usuario encontrado o null si no existe.
 * @throws {Error} - Lanza un error si hay un problema al consultar la base de datos.
 */
export async function getOneUser(data) {
    try {
        const fields = ["id", "username", "email"];
        const searchValue = data.trim();
        const user = await User.findOne({
            where: {
                [Op.and]: [
                    { isVisible: 1 }
                ],
                [Op.or]: fields.map((field) => ({ [field]: searchValue }))
            },
            raw: true
        });
        if (!user) {
            return null;
        }
        return user;
    } catch (error) {
        console.error(`Error al buscar usuario con Id, username o email "${data}":`, error.message);
        throw new Error(`Error al buscar usuario con Id, username o email "${data}": ${error.message}`);
    }
};

/**
 * Actualiza un usuario por ID, nombre de usuario o correo electrónico.
 *
 * @async
 * @function updateOneUser
 * @param {string[]} userInfo - Array de campos para buscar el usuario (id, username, email).
 * @param {object} newData - Datos para actualizar el usuario.
 * @returns {Promise<UserAttributes|null>} - El usuario actualizado o null si no existe.
 * @throws {Error} - Lanza un error si hay un problema al actualizar el usuario.
 */
export async function updateOneUser(userInfo, newData) {
    try {
        const user = await User.findOne({
            where: {
                [Op.or]: userInfo.map((field) => ({ [field]: data[field] }))
            },
            raw: true
        });
        if (!user) {
            return null;
        }
        await User.update(newData, {
            where: {
                [Op.or]: userInfo.map((field) => ({ [field]: data[field] }))
            }
        });
        return user;
    } catch (error) {
        console.error('Error al actualizar usuario:', error.message);
        throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
}

/**
 * Elimina (establece isVisible = 0) un usuario por ID, nombre de usuario o correo electrónico.
 *
 * @async
 * @function deleteUser
 * @param {string[]} userInfo - Array de campos para buscar el usuario (id, username, email).
 * @returns {Promise<UserAttributes|null>} - El usuario modificado (eliminado) o null si no existe.
 * @throws {Error} - Lanza un error si hay un problema al eliminar el usuario.
 */
export async function deleteUser(userInfo) {
    try {
        const user = await User.findOne({
            where: {
                [Op.or]: userInfo.map((field) => ({ [field]: data[field] }))
            },
            raw: true
        });
        if (!user) {
            return null;
        }
        user.isVisible = false;
        await user.save();
        return user;
    } catch (error) {
        console.error(`Error al eliminar el usuario ${userInfo}`, error.message);
        throw new Error(`Error al eliminar el Usuario: ${error.message}`);
    }
};