import { DataTypes } from 'sequelize';
import { getSequelizeConf } from '../../database/mysql.js';
import { Category } from './category.model.js';

const connection = getSequelizeConf();


//Definición del modelo Producto
export const Product = connection.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'categories', // Nombre de la tabla de categorías
            key: 'id'   // Clave primaria en la tabla de categorías
        }
    },
    bar_code: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true
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
        timestamps: true
    });

// Relación Many-To-many
Product.belongsTo(Category, { foreignKey: 'category_id' });
Category.hasMany(Product, { foreignKey: 'category_id' });

// CRUD Operations
/**
     * Create a new Product
     * @param {*} data -> new Product data
     * @returns newProduct -> New Product created
     */
export async function createNewProduct(data) {
    try {
        const fields = ["product_name", "bar_code"];
        const product = await Product.findOne({
            where: {
                [Op.or]: fields.map((field) => ({ [field]: data }))
            }
        });
        if (product) {
            return null;
        }
        const newProduct = await Product.create(data);
        return newProduct.dataValues;
    } catch (error) {
        console.error('Error al crear producto:', error);
    }
};

/**
 * Read (all Products)
 * @returns -> listado de productos
 */
export async function getAllProducts() {
    try {
        return await Product.findAll();
    } catch (error) {
        console.error('Error al obtener productos:', error);
        throw new Error('Error al consultar la base de datos.');
    }
};

/**
 * Buscar un producto por Productname o email
 * @param data -> product_name o bar_code
 * @returns Product -> producto encontrado
 */
export async function getOneProduct(data) {
    try {
        const fields = ["product_name", "bar_code"];
        const searchValue = data.trim(); // Asegura que no tenga espacios en blanco
        const product = await Product.findOne({
            where: {
                [Op.or]: fields.map((field) => ({ [field]: searchValue }))
            }
        });

        if (!product) {
            return null;
        }
        return product.dataValues;

    } catch (error) {
        console.error(`Error al buscar producto "${data}":`, error.message);
        throw new Error('Error al consultar la base de datos.');
    }
};

/**
 * Update one Product
 * @param {String} ProductInfo -> Productname or email
 * @param  newData -> data to be update
 * @returns  Product -> Product updated
 */
export async function updateOneProduct(productInfo, newData) {
    try {
        const fields = ["product_name", "bar_code"];
        const product = await Product.findOne({
            where: {
                [Op.or]: fields.map((field) => ({ [field]: productInfo }))
            }
        });

        if (!product) {
            throw new Error('producto no encontrado');
        }

        await Product.update(newData, {
            where: {
                [Op.or]: productInfo.map((field) => ({ [field]: newData[field] }))
            }
        });
        return product.dataValues;
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        throw new Error('Error al actualizar producto');
    }
}

/**
 * Delete (set isVisible = 0) an Product
 * @param {*} productInfo -> product_name or bar_code from Product
 * @returns  Product -> Product modified (deleted)
 */
export async function deleteProduct(productInfo) {
    try {
        const fields = ["product_name", "bar_code"];
        const product = await Product.findOne({
            where: {
                [Op.or]: fields.map((field) => ({ [field]: productInfo }))
            }
        });
        if (product) {
            await Product.destroy();
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error al eliminar producto:', error);
    }
}