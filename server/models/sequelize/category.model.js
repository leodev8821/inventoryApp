/** 
 * @author          Leonardo Caicedo, aka Leodev
 * @fileoverview    Módulo que define y gestiona el modelo de Categoría.
 * @module          category.model
 */
import { DataTypes } from 'sequelize';
import { getSequelizeConf } from '../../database/mysql.js';

/**
 * Conexión a la base de datos.
 */
const connection = getSequelizeConf();

/**
 * Definición del modelo Categoría.
 * @typedef {object} CategoryAttributes
 * @property {number} id - ID único de la categoría.
 * @property {string} category - Nombre de la categoría (debe ser único por usuario).
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
 * @param {string} data.category - Nombre de la categoría.
 * @returns {Promise<CategoryAttributes|null>} - La nueva categoría creada (objeto) o null si ya existe.
 * @throws {Error} - Lanza un error si hay un problema al consultar la base de datos.
 */
export async function createNewCategory(data) {
    try {
        const existCategory = await Category.findOne({
            where: {
                category: data.category
            }, raw: true
        });
        if (existCategory) {
            return null;
        }
        const newCategory = await Category.create(data);
        return newCategory.dataValues;
    } catch (error) {
        console.error('Error al crear la categoría:', error.message);
        throw new Error(`Error al crear la categoría en la base de datos: ${error.message}`);
    }
};

/**
 * Obtiene todas las categorías.
 *
 * @async
 * @function getAllCategories
 * @returns {Promise<CategoryAttributes[]>} - Lista de todas las categorías.
 * @throws {Error} - Lanza un error si hay un problema al consultar la base de datos.
 */
export async function getAllCategories() {
    try {
        // Obtener todas las categorías asociadas al usuario
        const categories = await Category.findAll({
            raw: true,
            order: [['category', 'ASC']]
        });

        return categories;
    } catch (error) {
        console.error('Error al obtener las categorías:', error.message);
        throw new Error(`Error al obtener las categorías de la base de datos: ${error.message}`);
    }
}

/**
 * Obtiene una categoría por nombre.
 *
 * @async
 * @function getOneCategory
 * @param {object} data - Datos de la categoría a buscar.
 * @param {string} data.category - Nombre de la categoría a buscar.
 * @returns {Promise<CategoryAttributes|null>} - La categoría encontrada (objeto) o null si no existe.
 * @throws {Error} - Lanza un error si hay un problema al consultar la base de datos.
 */
export async function getOneCategory(data) {
    try {
        const category = await Category.findOne({
            where: { category: data.category },
            raw: true
        });
        if (!category) {
            return null;
        }
        return category;
    } catch (error) {
        console.error(`Error al buscar la categoría "${data.category}":`, error.message);
        throw new Error(`Error al obtener la categoría de la base de datos: ${error.message}`);
    }
};

/**
 * Elimina una categoría por nombre.
 *
 * @async
 * @function deleteCategory
 * @param {object} data - Datos de la categoría a eliminar.
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
        console.error('Error al eliminar la categoría:', error.message);
        throw new Error(`Error al eliminar la categoría de la base de datos: ${error.message}`);
    }
}