import { DataTypes } from 'sequelize';
import { getSequelizeConf } from '../database/mysql.connection.js';

const connection = getSequelizeConf();

export default {
    /**
     * Función que define un modelo User
     * @returns User -> modelo del usuario
     */
    userModel: async () => {

        // Definición del modelo User
        const User = connection.define('User', {
            id_user: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            username: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true
            },
            first_name: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            last_names: {
                type: DataTypes.STRING(200),
                allowNull: false
            },
            email: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true
            },
            pass: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            address: {
                type: DataTypes.STRING(200),
                allowNull: false
            },
            isRegistered: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            isVisible: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
        }, {
            tableName: 'users', 
            timestamps: false
        });
        return User;
    }
}