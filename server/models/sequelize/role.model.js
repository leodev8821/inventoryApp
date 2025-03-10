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
 * 1 - Empleado
 * 2 - Encargado
 * 3 - Administrador
 * 4 - SuperUser (*^*)
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
 */
export async function getAllRoles() {
    try {
        const roles = await Role.findAll({
            raw: true,
        });
        return roles;
    } catch (error) {
        console.error('Error al obtener los Roles:', error);
        throw new Error('Error al obtener los Roles de la base de datos.');
    }
}