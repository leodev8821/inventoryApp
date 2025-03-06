import { DataTypes, Op } from 'sequelize';
import { getSequelizeConf } from '../../database/mysql.js';
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const connection = getSequelizeConf();

/**
 * @typedef {object} RoleAttributes
 * @property {number} id - ID único de la Rol.
 * @property {number} role - ID del rol al que pertenece (mas alto, mas permisos).
 * 0 - Empleado
 * 1 - Encargado
 * 2 - Administrador
 * 3 - SuperUser (*^*)
 */

/**
 * @typedef {import('sequelize').Model<RoleAttributes>} RoleInstance
 */

/**
 * Definición del modelo Rol.
 *
 * @type {import('sequelize').ModelStatic<RoleInstance>}
 */
export const Role = connection.define('Role', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    role: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'roles',
    timestamps: false
});

/**
 * Obtiene todos los Roles de un usuario.
 *
 * @async
 * @function getAllRoles
 * @param {object} data - Datos para filtrar los Roles.
 * @param {number} data.user_id - ID del usuario para filtrar los Roles.
 * @returns {Promise<Array<object>>} - Lista de todos los Roles del usuario.
 * @throws {Error} - Lanza un error si hay un problema al consultar la base de datos.
 */
export async function getAllRoles(role) {
    // Obtener la ruta absoluta del directorio del proyecto
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const envPath = join(__dirname, '../../../.env'); // Subir un nivel hasta 'project/.env'

    // Cargar el archivo .env manualmente
    dotenv.config({ path: envPath });

    const allowedRoles = process.env.ALLOWED_ROLES.split(',').map(Number);

    try {
        if (allowedRoles.includes(role)) {
            const roles = await Role.findAll({
                raw: true,
            });
            
            return roles;
        } else {
            console.error('Usuario no autorizado para obtener roles')
            return [];
        }

    } catch (error) {
        console.error('Error al obtener los Roles:', error);
        throw new Error('Error al obtener los Roles de la base de datos.');
    }
}