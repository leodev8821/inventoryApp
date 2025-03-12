/** 
 * @author          Leonardo Caicedo, aka Leodev
 * @fileoverview    Módulo que define y gestiona el modelo de Rol.
 * @module          role.model
 */
import { DataTypes } from 'sequelize';
import { getSequelizeConf } from '../../database/mysql.js';

/**
 * Conexión a la base de datos.
 */
const connection = getSequelizeConf();

/**
 * Atributos del modelo Rol.
 * @typedef {object} RoleAttributes
 * @property {number} id - ID único del Rol.
 * @property {number} role - ID del rol al que pertenece (mas alto, mas permisos).
 * 1 - Empleado
 * 2 - Encargado
 * 3 - Administrador
 * 4 - SuperUser (*^*)
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
 * Obtiene todos los Roles.
 *
 * @async
 * @function getAllRoles
 * @returns {Promise<RoleAttributes[]>} - Lista de todos los roles.
 * @throws {Error} - Lanza un error si hay un problema al consultar la base de datos.
 */
export async function getAllRoles() {
    try {
        const roles = await Role.findAll({
            raw: true,
        });
        return roles;
    } catch (error) {
        console.error('Error al obtener los Roles:', error.message);
        throw new Error(`Error al obtener los Roles de la base de datos: ${error.message}`);
    }
}