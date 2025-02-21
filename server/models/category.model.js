import { DataTypes } from 'sequelize';
import { getSequelizeConf } from '../database/mysql.js';

const connection = getSequelizeConf();

// Category model definition
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
     * Create a new Category
     * @param {*} data -> new Category data
     * @returns newCategory -> New Category created
     */
export async function createNewCategory(data) {
    try {
        const existCategory = await Category.findOne({
            where: { [Op.or]: [{ category: data }] }
        });
        if (existCategory) {
            return null;
        }
        const newCategory = await Category.create(data);
        return newCategory.dataValues;
    } catch (error) {
        console.error('Error al crear Usuario:', error);
        throw new Error('Error al consultar la base de datos.');
    }
};

/**
 * Read (all Categories)
 * @returns -> All categories list
 */
export async function getAllCategories() {
    try {
        return await Category.findAll();
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        throw new Error('Error al consultar la base de datos.');
    }
};

/**
 * To search an Category by name
 * @param data -> searched category's name
 * @returns category -> founded category
 */
export async function getOneCategory(data) {
    try {
        const category = await Category.findOne({
            where: { [Op.or]: [{ category: data }] }
        });
        if (!category) {
            return null;
        }
        return category.dataValues;
    } catch (error) {
        console.error(`Error al buscar la categoría "${data}":`, error.message);
        throw new Error('Error al consultar la base de datos.');
    }
};

/**
 * To delete an category by Name
 * @param {*} data -> the category's name
 * @returns {Boolean} -> true if deleted
 */
export async function deleteCategory(data) {
    try {
        const category = await Category.findOne({
            where: { [Op.or]: [{ category: data }] }
        });
        if (category) {
            await category.destroy();
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error al eliminar la categoría:', error);
    }
}