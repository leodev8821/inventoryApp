import { DataTypes } from 'sequelize';
import { getSequelizeConf } from '../database/mysql.connection.js';

const connection = getSequelizeConf();


//Definición del modelo Producto
const Product = connection.define('Product', {
    id_product: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'categories', // Nombre de la tabla de categorías
            key: 'id_category'   // Clave primaria en la tabla de categorías
        }
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
    }
},
    {
        tableName: 'products',
        timestamps: false
    });

export default Product;