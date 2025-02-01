import { DataTypes } from 'sequelize';
import { getSequelizeConf } from '../database/mysql.connection.js';

const connection = getSequelizeConf();

export default {
    productModel: async () => {

        // Definición del modelo Student
        const Product = connection.define('Product', {
            id_product: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING(150),
                allowNull: false,
                unique: true
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            buy_price: {
                type: DataTypes.DECIMAL(10,2),
                allowNull: false,
            },
            sell_price: {
                type: DataTypes.DECIMAL(10,2),
                allowNull: false,
            }
        }, {
            tableName: 'products', 
            timestamps: false
        });
        return Product;
    }
}