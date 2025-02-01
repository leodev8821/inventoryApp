import { DataTypes } from 'sequelize';
import { getSequelizeConf } from '../database/mysql.connection.js';

const connection = getSequelizeConf();

export default {
    /**
     * Función que define un modelo User
     * @returns User -> modelo del usuario
     */
    categoryModel: async () => {

        // Definición del modelo User
        const Category = connection.define('Category', {
            id_category: {
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
        return Category;
    }
}