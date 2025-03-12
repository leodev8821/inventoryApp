/** 
 * @author          Leonardo Caicedo, aka Leodev
 * @fileoverview    Módulo que define y gestiona el modelo de Inventario.
 * @module          inventory.model
 */
import { DataTypes } from 'sequelize';
import { getSequelizeConf } from '../../database/mysql.js';
import { Product } from './product.model.js';

/**
 * Conexión a la base de datos.
 */
const connection = getSequelizeConf();

/**
 * Definición del modelo Inventario.
 * @typedef {object} InventoryAttributes
 * @property {number} id - ID único del registro de inventario.
 * @property {number} product_id - ID del producto asociado.
 * @property {number} quantity - Cantidad en inventario.
 * @property {number} value - Valor de los productos en inventario.
 * @property {boolean} isVisible - Indica si el registro es visible.
 */
export const Inventory = connection.define('Inventory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'products', // Hace referencia a la tabla de productos
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    value: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
        allowNull: false
    },
    isVisible: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
}, {
    tableName: 'inventories',
    timestamps: false
});

// Definición de relaciones

// Un registro de inventario pertenece a un producto.
Inventory.belongsTo(Product, { foreignKey: 'product_id', onDelete: 'CASCADE' });
// Un producto puede tener muchos registros en el inventario.
Product.hasMany(Inventory, { foreignKey: 'product_id', onDelete: 'CASCADE' });

/**
 * Crea un nuevo registro de inventario.
 *
 * @async
 * @function createNewInventory
 * @param {object} data - Datos del nuevo registro de inventario.
 * @param {number} data.product_id - ID del producto asociado.
 * @param {number} data.quantity - Cantidad en inventario.
 * @param {number} data.value - Valor del producto en inventario.
 * @param {boolean} data.isVisible - Indica si el registro es visible.
 * @returns {Promise<InventoryAttributes>} - El nuevo registro de inventario creado.
 * @throws {Error} - Lanza un error si hay un problema al consultar la base de datos.
 */
export async function createNewInventory(data) {
    try {
        const newRegister = await Inventory.create(data);
        return newRegister.dataValues;
    } catch (error) {
        console.error('Error al crear el registro de inventario:', error.message);
        throw new Error(`Error al crear el registro de inventario de la base de datos. ${error.message}`);
    }
};

/**
 * Obtiene todos los registros de inventario.
 *
 * @async
 * @function getAllInventories
 * @returns {Promise<InventoryAttributes[]>} - Lista de todos los registros de inventario.
 * @throws {Error} - Lanza un error si hay un problema al consultar la base de datos.
 */
export async function getAllInventories() {
    try {
        const registers = await Inventory.findAll({raw: true});
        return registers.map(register => register);
    } catch (error) {
        console.error('Error al obtener los registros de inventario:', error.message);
        throw new Error(`Error al obtener los registros de inventario de la base de datos. ${error.message}`);
    }
};

/**
 * Obtiene un registro de inventario por ID de producto.
 *
 * @async
 * @function getInventoryByProductId
 * @param {number} productID - ID del producto para buscar el registro de inventario.
 * @returns {Promise<InventoryAttributes|null>} - El registro de inventario encontrado o null si no existe.
 * @throws {Error} - Lanza un error si hay un problema al consultar la base de datos.
 */
export async function getInventoryByProductId(productID) {
    try {
        const register = await Inventory.findOne({
            where: {
                product_id: productID,
            },
            raw: true
        });
        if (!register) {
            return null;
        }
        return register;
    } catch (error) {
        console.error('Error al obtener el registro de inventario:', error.message);
        throw new Error(`Error al obtener el registro de inventario de la base de datos: ${error.message}`);
    }
};

/**
 * Actualiza un registro de inventario por ID de producto.
 *
 * @async
 * @function updateInventory
 * @param {number} productID - ID del producto para actualizar el registro de inventario.
 * @param {object} data - Datos para actualizar el registro de inventario.
 * @param {number} data.quantity - Nueva cantidad en inventario.
 * @param {boolean} data.isVisible - Nuevo valor para la visibilidad del registro.
 * @returns {Promise<InventoryAttributes|null>} - El registro de inventario actualizado o null si no existe.
 * @throws {Error} - Lanza un error si hay un problema al consultar la base de datos.
 */
export async function updateInventory(productID, data) {
    try {
        const register = await Inventory.findOne({
            where: {
                id: id,
            },
            raw: true
        });

        if (!register) {
            return null;
        }

        // Actualiza solo los campos que se envían en el objeto "data"
        if (data.quantity !== undefined) register.quantity = data.quantity;
        if (data.isVisible !== undefined) register.isVisible = data.isVisible;

        await register.save({where: {
            id: productID
        }});
        return register;
    } catch (error) {
        console.error('Error al actualizar el registro de inventario:', error);
        throw new Error(`Error al actualizar el registro de inventario en la base de datos: ${error.message}`);
    }
};

/**
 * Elimina un registro de inventario por ID.
 *
 * @async
 * @function deleteInventory
 * @param {number} id - ID del registro de inventario a eliminar.
 * @returns {Promise<InventoryAttributes|null>} - El registro de inventario eliminado o null si no existe.
 * @throws {Error} - Lanza un error si hay un problema al consultar la base de datos.
 */
export async function deleteInventory(id) {
    try {
        const register = await Inventory.findOne({
            where: {
                id: id
            },
            raw: true
        });
        if (!register) {
            return null;
        }
        register.isVisible = false;

        await register.save();
        return register;
    } catch (error) {
        console.error('Error al eliminar el registro de inventario:', error);
        throw new Error(`Error al eliminar el registro de inventario en la base de datos: ${error.message}`);
    }
};