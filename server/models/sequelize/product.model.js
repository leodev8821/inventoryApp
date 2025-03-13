/** 
 * @author          Leonardo Caicedo, aka Leodev
 * @fileoverview    Módulo que define y gestiona el modelo de Producto.
 * @module          product.model
 */
import { DataTypes, Op } from 'sequelize';
import { getSequelizeConf } from '../../database/mysql.js';
import { Category } from './category.model.js';

/**
 * Conexión a la base de datos.
 */
const connection = getSequelizeConf();

/**
 * Definición del modelo Producto.
 * @typedef {object} ProductAttributes
 * @property {number} id - ID único del producto.
 * @property {number} category_id - ID de la categoría a la que pertenece el producto.
 * @property {string} bar_code - Código de barras del producto.
 * @property {string} product_name - Nombre del producto.
 * @property {string} description - Descripción del producto.
 * @property {number} buy_price - Precio de compra del producto.
 * @property {number} sell_price - Precio de venta del producto.
 * @property {string|null} image_url - URL de la imagen del producto.
 */
export const Product = connection.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'categories',
            key: 'id'
        }
    },
    bar_code: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true
    },
    product_name: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    buy_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    sell_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    image_url: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
},
    {
        tableName: 'products',
        timestamps: true
    });

/**
 * Relación: Un producto pertenece a una categoría.
 *
 * @description Establece la relación "belongsTo" entre Product y Category, usando 'category_id' como clave foránea.
 * @see {@link Category}
 */
Product.belongsTo(Category, { foreignKey: 'category_id' });

/**
 * Relación: Una categoría tiene muchos productos.
 *
 * @description Establece la relación "hasMany" entre Category y Product, usando 'category_id' como clave foránea.
 * @see {@link Product}
 */
Category.hasMany(Product, { foreignKey: 'category_id', onDelete: 'CASCADE' });

/**
 * Crea un nuevo producto y un registro de inventario inicial para él.
 *
 * @async
 * @function createNewProduct
 * @param {object} data - Datos del nuevo producto.
 * @param {number} data.category_id - ID de la categoría del producto.
 * @param {string} data.bar_code - Código de barras del producto.
 * @param {string} data.product_name - Nombre del producto.
 * @param {string} data.description - Descripción del producto.
 * @param {number} data.buy_price - Precio de compra del producto.
 * @param {number} data.sell_price - Precio de venta del producto.
 * @param {string|null} data.image_url - URL de la imagen del producto.
 * @returns {Promise<ProductAttributes|null>} - El nuevo producto creado (objeto) o null si ya existe un producto con el mismo nombre o código de barras en la misma categoría.
 * @throws {Error} - Lanza un error si hay un problema al consultar la base de datos o al crear el registro de inventario.
 */
export async function createNewProduct(data) {
    try {
        const existProduct = await Product.findOne({
            where: {
                [Op.and]: [
                    { category_id: data.category_id },
                    {
                        [Op.or]: [
                            { product_name: data.product_name },
                            { bar_code: data.bar_code }
                        ]
                    }
                ]
            },
            raw: true
        });

        if (existProduct) {
            return null;
        }

        const newProduct = await Product.create(data);

        await newProduct.createInventory({});

        return newProduct.dataValues;
    } catch (error) {
        console.error('Error al crear producto:', error);
        throw new Error(`Error al crear producto: ${error.message}`);
    }
};

/**
 * Obtiene todos los productos.
 *
 * @async
 * @function getAllProducts
 * @returns {Promise<ProductAttributes[]>} - Lista de todos los productos.
 * @throws {Error} - Lanza un error si hay un problema al consultar la base de datos.
 */
export async function getAllProducts() {
    try {
        return await Product.findAll({ raw: true });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        throw new Error(`Error al obtener productos: ${error.message}`);
    }
};

/**
 * Obtiene todos los productos por categoría.
 *
 * @async
 * @function getAllProductsByCategory
 * @param {object} data - Datos para filtrar los productos por categoría.
 * @param {number} data.category_id - ID de la categoría para filtrar los productos.
 * @returns {Promise<ProductAttributes[]>} - Lista de productos filtrados por categoría.
 * @throws {Error} - Lanza un error si hay un problema al consultar la base de datos.
 */
export async function getAllProductsByCategory(data) {
    try {
        return await Product.findAll({
            where: {
                category_id: data.category_id
            },
            raw: true
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        throw new Error(`Error al obtener productos: ${error.message}`);
    }
};

/**
 * Obtiene un producto por ID, nombre o código de barras.
 *
 * @async
 * @function getOneProduct
 * @param {string|number} data - ID, nombre o código de barras del producto a buscar.
 * @returns {Promise<ProductAttributes|null>} - El producto encontrado o null si no existe.
 * @throws {Error} - Lanza un error si hay un problema al consultar la base de datos.
 */
export async function getOneProduct(data) {
    try {
        const product = await Product.findOne({
            where: {
                [Op.or]: [
                    { id: data },
                    { product_name: data },
                    { bar_code: data }
                ]
            },
            raw: true
        });

        if (!product) {
            return null;
        }
        return product;
    } catch (error) {
        console.error(`Error al buscar producto "${data.searchValue}":`, error.message);
        throw new Error(`Error al buscar producto: ${error.message}`);
    }
};

/**
 * Actualiza un producto por ID, nombre o código de barras.
 *
 * @async
 * @function updateOneProduct
 * @param {string|number} data - ID, nombre o código de barras del producto a actualizar.
 * @param {object} newData - Datos para actualizar el producto.
 * @returns {Promise<ProductAttributes|null>} - El producto actualizado o null si no existe.
 * @throws {Error} - Lanza un error si hay un problema al consultar la base de datos.
 */
export async function updateOneProduct(data, newData) {
    try {
        const product = await Product.findOne({
            where: {
                [Op.or]: [
                    { id: data },
                    { product_name: data },
                    { bar_code: data },
                ],
            },
            raw: true
        });

        if (!product) {
            return null;
        }

        await Product.update(newData, {
            where: { id: product.id }
        });

        return { ...product, ...newData };
    } catch (error) {
        console.error('Error al actualizar producto:', error.message);
        throw new Error(`Error al actualizar producto en la base de datos: ${error.message}`);
    }
};

/**
 * Elimina un producto por ID, nombre o código de barras.
 *
 * @async
 * @function deleteProduct
 * @param {string|number} data - ID, nombre o código de barras del producto a eliminar.
 * @returns {Promise<boolean>} - `true` si el producto fue eliminado, `false` si no se encontró.
 * @throws {Error} - Lanza un error si hay un problema al consultar la base de datos.
 */
export async function deleteProduct(data) {
    try {
        const product = await Product.findOne({
            where: {
                [Op.or]: [
                    { id: data },
                    { product_name: data },
                    { bar_code: data },
                ],
            },
        });

        if (!product) {
            return false;
        }

        await Product.destroy({
            where: { id: product.id },
        });

        return true;
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        throw new Error(`Error al eliminar producto de la base de datos: ${error.message}`);
    }
};