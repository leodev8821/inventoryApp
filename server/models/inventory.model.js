import { DataTypes } from 'sequelize';
import { getSequelizeConf } from '../database/mysql.connection.js';

const connection = getSequelizeConf();

export default {
    inventoryModel: async () => {

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
            },
            product_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            isVisible: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
        }, {
            tableName: 'inventories', 
            timestamps: false
        });
        return Inventory;
    }
}