import { DataTypes } from 'sequelize';
import { getSequelizeConf } from '../database/mysql.js';
import { getOneUser, User } from './user.model.js';
import { getOneProduct, Product } from './product.model.js';

const connection = getSequelizeConf();


// Definición del modelo Student
export const Inventory = connection.define('Inventory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isVisible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'inventories',
    timestamps: false
});

// Relación Many-To-many
User.belongsToMany(Product, { through: Inventory });
Product.belongsToMany(User, { through: Inventory });

// CRUD Operations
// Create
export async function newProductByUser(username, product_barcode, quantity) {
    try {
        const registerUser = await getOneUser(username);
        const product = await getOneProduct(product_barcode);

        if (registerUser && product) {
            const newStoredProduct = await Inventory.create({ user_id: [registerUser.dataValues.id], product_id: [product.dataValues.id], quantity });
            return { newStoredProduct, registerUser, product };
        }

    } catch (error) {
        console.error('Error al crear Producto:', error);
        return null;
    }
}