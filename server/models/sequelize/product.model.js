import { DataTypes, Op } from 'sequelize';
import { getSequelizeConf } from '../../database/mysql.js';
import { Category } from './category.model.js';
import { User } from './user.model.js';

const connection = getSequelizeConf();


/**
 * @typedef {object} ProductAttributes
 * @property {number} id - ID único del producto.
 * @property {number} user_id - ID del usuario que creó el producto.
 * @property {number} category_id - ID de la categoría del producto.
 * @property {string} bar_code - Código de barras del producto (único).
 * @property {string} product_name - Nombre del producto (único).
 * @property {string} description - Descripción del producto.
 * @property {number} buy_price - Precio de compra del producto.
 * @property {number} sell_price - Precio de venta del producto.
 * @property {string|null} image_url - URL de la imagen del producto (opcional).
 * @property {Date} createdAt - Fecha de creación del registro.
 * @property {Date} updatedAt - Fecha de última actualización del registro.
 */

/**
 * @typedef {import('sequelize').Model<ProductAttributes>} ProductInstance
 */

/**
 * Definición del modelo Producto.
 *
 * @type {import('sequelize').ModelStatic<ProductInstance>}
 */
export const Product = connection.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'       
        }
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
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
 * Relación: Un producto pertenece a un usuario.
 *
 * @description Establece la relación "belongsTo" entre Product y User, usando 'user_id' como clave foránea.
 * @see {@link User}
 */
Product.belongsTo(User, { foreignKey: 'user_id' });

/**
 * Relación: Un usuario tiene muchos productos.
 *
 * @description Establece la relación "hasMany" entre User y Product, usando 'user_id' como clave foránea.
 * @see {@link Product}
 */
User.hasMany(Product, { foreignKey: 'user_id', onDelete: 'CASCADE' });

/**
 * Crea un nuevo producto.
 * @param {object} data - Datos del producto.
 * @param {number} data.user_id - ID del usuario.
 * @param {number} data.category_id - ID de la categoría.
 * @param {string} data.product_name - Nombre del producto.
 * @param {string} data.bar_code - Código de barras del producto.
 * @returns {Promise<object|null>} - Producto creado o null si ya existe.
 * @throws {Error} - Error al crear el producto.
 */
export async function createNewProduct(data) {
    try {
        const existProduct = await Product.findOne({
            where: {
                [Op.and]: [
                    { user_id: data.user_id },
                    { category_id: data.category_id },
                    {
                        [Op.or]: [
                            { product_name: data.product_name },
                            { bar_code: data.bar_code }
                        ]
                    }
                ]
            }
        });

        if (existProduct) {
            return null;
        }

        const newProduct = await Product.create(data);
        return newProduct.dataValues;
    } catch (error) {
        console.error('Error al crear producto:', error);
        throw new Error(`Error al crear producto: ${error.message}`);
    }
};

/**
 * Obtiene todos los productos de un usuario y categoría.
 * @param {object} data - Datos para filtrar los productos.
 * @param {number} data.user_id - ID del usuario.
 * @param {number} data.category_id - ID de la categoría.
 * @returns {Promise<Array<object>>} - Lista de productos.
 * @throws {Error} - Error al obtener los productos.
 */
export async function getAllProducts(data) {
    try {
        return await Product.findAll({
            where: {
                user_id: data.user_id,
                category_id: data.category_id
            }
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        throw new Error(`Error al obtener productos: ${error.message}`);
    }
};

/**
 * Obtiene un producto por nombre o código de barras.
 * @param {object} data - Datos del producto.
 * @param {number} data.user_id - ID del usuario.
 * @param {number} data.category_id - ID de la categoría.
 * @param {string} data.searchValue - Nombre o código de barras del producto.
 * @returns {Promise<object|null>} - Producto encontrado o null.
 * @throws {Error} - Error al obtener el producto.
 */
export async function getOneProduct(data) {
    try {
        const product = await Product.findOne({
            where: {
                [Op.and]: [
                    { user_id: data.user_id },
                    { category_id: data.category_id },
                    {
                        [Op.or]: [
                            { product_name: data.searchValue },
                            { bar_code: data.searchValue }
                        ]
                    }
                ]
            }
        });

        if (!product) {
            return null;
        }
        return product.dataValues;
    } catch (error) {
        console.error(`Error al buscar producto "${data.searchValue}":`, error.message);
        throw new Error(`Error al buscar producto: ${error.message}`);
    }
};

/**
 * Actualiza un producto.
 * @param {object} data - Datos para buscar el producto.
 * @param {number} data.user_id - ID del usuario.
 * @param {number} data.category_id - ID de la categoría.
 * @param {string} data.searchValue - Nombre o código de barras del producto.
 * @param {object} newData - Datos a actualizar.
 * @returns {Promise<object|null>} - El producto actualizado o null.
 * @throws {Error} - Lanza un error si hay un problema con la base de datos.
 */
export async function updateOneProduct(data, newData) {
    try {
        const product = await Product.findOne({
            where: {
                [Op.and]: [
                    { user_id: data.user_id },
                    { category_id: data.category_id },
                    {
                        [Op.or]: [
                            { product_name: data.searchValue },
                            { bar_code: data.searchValue },
                        ],
                    },
                ],
            },
        });

        if (!product) {
            return null;
        }

        await Product.update(newData, {
            where: { id: product.id },
        });

        return { ...product.dataValues, ...newData };
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        throw new Error('Error al actualizar producto en la base de datos.');
    }
};

/**
 * Elimina un producto lógicamente.
 * @param {object} data - Datos para buscar el producto.
 * @param {number} data.user_id - ID del usuario.
 * @param {number} data.category_id - ID de la categoría.
 * @param {string} data.searchValue - Nombre o código de barras del producto.
 * @returns {Promise<boolean>} - True si se eliminó, false si no.
 * @throws {Error} - Lanza un error si hay un problema con la base de datos.
 */
export async function deleteProduct(data) {
    try {
        const product = await Product.findOne({
            where: {
                [Op.and]: [
                    { user_id: data.user_id },
                    { category_id: data.category_id },
                    {
                        [Op.or]: [
                            { product_name: data.searchValue },
                            { bar_code: data.searchValue },
                        ],
                    },
                ],
            },
        });

        if (!product) {
            return false;
        }

        await Product.update({ deletedAt: new Date() }, {
            where: { id: product.id },
        });

        return true;
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        throw new Error('Error al eliminar producto de la base de datos.');
    }
};