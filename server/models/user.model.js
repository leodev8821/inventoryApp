import { DataTypes } from 'sequelize';
import { getSequelizeConf } from '../database/mysql.connection.js';

const connection = getSequelizeConf();

export default {
    userModel: async () => {

        // Definición del modelo Student
        const User = connection.define('User', {
            id_user: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            lastnames: {
                type: DataTypes.STRING(200),
                allowNull: false
            },
            dni: {
                type: DataTypes.STRING(9),
                allowNull: false,
                unique: true
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
            phone: {
                type: DataTypes.STRING(15),
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