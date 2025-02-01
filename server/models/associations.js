//import { Sequelize } from "sequelize";
import userModel from "./user.model.js";
import productModel from "./product.model.js";
import inventoryModel from "./inventory.model.js";

export default {
    setUpAssociations: async () => {
        userModel.hasMany(inventoryModel, {
            foreignKey: 'user_id',
            sourceKey: 'id_user',
            onDelete: 'CASCADE'
        });

        inventoryModel.belongsTo(userModel, {
            foreignKey: 'user_id',
            targetKey: 'id_user'
        });

        productModel.hasMany(inventoryModel, {
            foreignKey: 'product_id',
            sourceKey: 'id_product',
            onDelete: 'CASCADE'
        });

        inventoryModel.belongsTo(productModel, {
            foreignKey: 'product_id',
            targetKey: 'id_product'
        });

        console.info("Relaciones configuradas correctamente");
    }
}