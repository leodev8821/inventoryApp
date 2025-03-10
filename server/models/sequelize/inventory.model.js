import { DataTypes } from 'sequelize';
import { getSequelizeConf } from '../../database/mysql.js';
import { getOneUser, User } from './user.model.js';
import { getOneProduct, Product } from './product.model.js';

const connection = getSequelizeConf();

/**
 * @typedef {object} InventoryAttributes
 * @property {number} id - ID único de la entrada de inventario.
 * @property {number} product_id - ID del producto al que se asocia el movimiento.
 * @property {number} user_id - ID del usuario que realizó el cambio.
 * @property {number} change - Variación en la cantidad (puede ser positiva o negativa).
 * @property {Date} createdAt - Fecha en la que se registró el movimiento.
 */

/**
 * @typedef {import('sequelize').Model<InventoryAttributes>} InventoryInstance
 */

/**
 * Definición del modelo Inventory.
 *
 * @type {import('sequelize').ModelStatic<InventoryInstance>}
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
    timestamps: false // Solo se registra la fecha de creación
});

// Definición de relaciones

// Un registro de inventario pertenece a un producto.
Inventory.belongsTo(Product, { foreignKey: 'product_id', onDelete: 'CASCADE' });
// Un producto puede tener muchos registros en el inventario.
Product.hasMany(Inventory, { foreignKey: 'product_id', onDelete: 'CASCADE' });


// CRUD Operations
/**
 * Crea un nuevo registro de inventario para un usuario.
 * @param {object} data - Datos para crear el registro (debe incluir product_id, user_id y change).
 * @returns {object|null} - Devuelve el registro creado o null en caso de error de validación.
 */
export async function createNewInventory(data) {
    try {
        // Aquí puedes agregar validaciones adicionales si es necesario.
        const newInventory = await Inventory.create(data);
        return newInventory.dataValues;
    } catch (error) {
        console.error('Error al crear el registro de inventario:', error);
        throw new Error('Error al crear el registro de inventario en la base de datos.');
    }
};

/**
 * Obtiene todos los registros de inventario de un usuario específico.
 * @param {number} userId - ID del usuario.
 * @returns {Array} - Lista de registros de inventario.
 */
export async function getAllInventories() {
    try {
        const inventories = await Inventory.findAll();
        return inventories.map(inventory => inventory.dataValues);
    } catch (error) {
        console.error('Error al obtener los registros de inventario:', error);
        throw new Error('Error al obtener los registros de inventario de la base de datos.');
    }
};

/**
 * Obtiene un registro de inventario por su ID, asegurándose de que pertenezca al usuario.
 * @param {number} id - ID del registro de inventario.
 * @param {number} userId - ID del usuario.
 * @returns {object|null} - Registro encontrado o null si no existe o no pertenece al usuario.
 */
export async function getInventoryById(id) {
    try {
        const inventory = await Inventory.findOne({
            where: {
                id: id
            }
        });
        if (!inventory) {
            return null;
        }
        return inventory.dataValues;
    } catch (error) {
        console.error('Error al obtener el registro de inventario:', error);
        throw new Error('Error al obtener el registro de inventario de la base de datos.');
    }
};

/**
 * Actualiza un registro de inventario por su ID, asegurándose de que pertenezca al usuario.
 * @param {number} id - ID del registro a actualizar.
 * @param {number} userId - ID del usuario.
 * @param {object} data - Datos a actualizar (por ejemplo, product_id, change).
 * @returns {object|null} - Registro actualizado o null si no se encontró o no pertenece al usuario.
 */
export async function updateInventory(id, data) {
    try {
        const inventory = await Inventory.findOne({
            where: {
                id: id,
            }
        });
        if (!inventory) {
            return null;
        }
        // Actualiza solo los campos que se envían en el objeto "data"
        if (data.product_id !== undefined) inventory.product_id = data.product_id;
        if (data.change !== undefined) inventory.change = data.change;
        // Nota: usualmente no se actualiza el user_id ya que indica el dueño del registro.
        await inventory.save();
        return inventory.dataValues;
    } catch (error) {
        console.error('Error al actualizar el registro de inventario:', error);
        throw new Error('Error al actualizar el registro de inventario en la base de datos.');
    }
};

/**
 * Elimina un registro de inventario por su ID, asegurándose de que pertenezca al usuario.
 * @param {number} id - ID del registro a eliminar.
 * @param {number} userId - ID del usuario.
 * @returns {object|null} - Registro eliminado o null si no se encontró o no pertenece al usuario.
 */
export async function deleteInventory(id) {
    try {
        const inventory = await Inventory.findOne({
            where: {
                id: id
            }
        });
        if (!inventory) {
            return null;
        }
        await inventory.destroy();
        return inventory.dataValues;
    } catch (error) {
        console.error('Error al eliminar el registro de inventario:', error);
        throw new Error('Error al eliminar el registro de inventario en la base de datos.');
    }
};