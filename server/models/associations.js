import userModel from "./user.model.js";
import productModel from "./product.model.js";
import inventoryModel from "./inventory.model.js";
import categoryModel from "./category.model.js";

import HasMany from "sequelize";

const hasMany = new HasMany();

export default {
    setUpAssociations: async () => {
        // Relaciones entre User e Inventory
        userModel.hasMany(inventoryModel, {
            foreignKey: 'user_id',
            sourceKey: 'id_user',
            onDelete: 'CASCADE',
        });

        inventoryModel.belongsTo(userModel, {
            foreignKey: 'user_id',
            targetKey: 'id_user'
        });

        // Relaciones entre Product e Inventory
        productModel.hasMany(inventoryModel, {
            foreignKey: 'product_id',
            sourceKey: 'id_product',
            onDelete: 'CASCADE'
        });

        inventoryModel.belongsTo(productModel, {
            foreignKey: 'product_id',
            targetKey: 'id_product'
        });

        // Relaciones entre Product y Category
        productModel.belongsTo(categoryModel, {
            foreignKey: 'category_id',
            targetKey: 'id_category'
        });

        categoryModel.hasMany(productModel, {
            foreignKey: 'category_id',
            sourceKey: 'id_category'
        });

        console.info("Relaciones configuradas correctamente");
    }
}