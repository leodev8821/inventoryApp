import { DataTypes } from 'sequelize';
import { getSequelizeConf } from '../database/mysql.connection.js';

const connection = getSequelizeConf();


// Definición del modelo Student
const Inventory = connection.define('Inventory', {
    id_inventory: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users', // Nombre de la tabla de users
            key: 'id_user'   // Clave primaria en la tabla de users
        }
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'products', // Nombre de la tabla de products
            key: 'id_product'   // Clave primaria en la tabla de products
        }
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

export default Inventory;