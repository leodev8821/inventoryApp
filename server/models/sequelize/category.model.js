import { DataTypes, Op } from 'sequelize';
import { User } from './user.model.js';
import { getSequelizeConf } from '../../database/mysql.js';

const connection = getSequelizeConf();

/**
 * @typedef {object} CategoryAttributes
 * @property {number} id - ID único de la categoría.
 * @property {number} user_id - ID del usuario al que pertenece la categoría.
 * @property {string} category - Nombre de la categoría (debe ser único por usuario).
 */

/**
 * @typedef {import('sequelize').Model<CategoryAttributes>} CategoryInstance
 */

/**
 * Definición del modelo Categoría.
 *
 * @type {import('sequelize').ModelStatic<CategoryInstance>}
 */
export const Category = connection.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    category: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'categories',
    timestamps: false
});

/**
 * Crea una nueva categoría.
 *
 * @async
 * @function createNewCategory
 * @param {object} data - Datos de la nueva categoría.
 * @param {number} data.user_id - ID del usuario propietario de la categoría.
 * @param {string} data.category - Nombre de la categoría.
 * @returns {Promise<object|null>} - La nueva categoría creada (objeto) o null si ya existe.
 * @throws {Error} - Lanza un error si hay un problema al consultar la base de datos.
 */
export async function createNewCategory(data) {
    try {
        const existCategory = await Category.findOne({
            where: {
                category: data.category
            }
        });
        if (existCategory) {
            return null;
        }
        const newCategory = await Category.create(data);
        return newCategory.dataValues;
    } catch (error) {
        console.error('Error al crear la categoría:', error);
        throw new Error('Error al crear la categoría en la base de datos.');
    }
};

/**
 * Obtiene todas las categorías de un usuario.
 *
 * @async
 * @function getAllCategories
 * @param {object} data - Datos para filtrar las categorías.
 * @param {number} data.user_id - ID del usuario para filtrar las categorías.
 * @returns {Promise<Array<object>>} - Lista de todas las categorías del usuario.
 * @throws {Error} - Lanza un error si hay un problema al consultar la base de datos.
 */
export async function getAllCategories(userId) {
    try {
        // Obtener todas las categorías asociadas al usuario
        const categories = await Category.findAll({
            raw: true,
            order: [['category', 'ASC']]
        });

        return categories; // Devuelve directamente el array de categorías
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        throw new Error('Error al obtener las categorías de la base de datos.');
    }
}

/**
 * Obtiene una categoría por nombre y usuario.
 *
 * @async
 * @function getOneCategory
 * @param {object} data - Datos de la categoría a buscar.
 * @param {number} data.user_id - ID del usuario propietario de la categoría.
 * @param {string} data.category - Nombre de la categoría a buscar.
 * @returns {Promise<object|null>} - La categoría encontrada (objeto) o null si no existe.
 * @throws {Error} - Lanza un error si hay un problema al consultar la base de datos.
 */
export async function getOneCategory(data) {
    try {
        const category = await Category.findOne({
            where: { category: data.category }
        });
        if (!category) {
            return null;
        }
        return category.dataValues;
    } catch (error) {
        console.error(`Error al buscar la categoría "${data.category}":`, error.message);
        throw new Error('Error al obtener la categoría de la base de datos.');
    }
};

/**
 * Elimina una categoría por nombre y usuario.
 *
 * @async
 * @function deleteCategory
 * @param {object} data - Datos de la categoría a eliminar.
 * @param {number} data.user_id - ID del usuario propietario de la categoría.
 * @param {string} data.category - Nombre de la categoría a eliminar.
 * @returns {Promise<boolean>} - True si la categoría fue eliminada, false si no.
 * @throws {Error} - Lanza un error si hay un problema al consultar la base de datos.
 */
export async function deleteCategory(data) {
    try {
        const category = await Category.findOne({
            where: { category: data.category }
        });
        if (category) {
            await category.destroy();
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error al eliminar la categoría:', error);
        throw new Error('Error al eliminar la categoría de la base de datos.');
    }
}