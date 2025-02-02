import User from "./user.model.js";
import Product from "./product.model.js";
import Inventory from "./inventory.model.js";
import Category from "./category.model.js";

export default {
    setUpAssociations: async () => {
        // Relaciones entre User e Inventory
        User.hasMany(Inventory, {
            foreignKey: 'user_id',
            sourceKey: 'id_user',
            onDelete: 'CASCADE',
        });

        Inventory.belongsTo(User, {
            foreignKey: 'user_id',
            targetKey: 'id_user'
        });

        // Relaciones entre Product e Inventory
        Product.hasMany(Inventory, {
            foreignKey: 'product_id',
            sourceKey: 'id_product',
            onDelete: 'CASCADE'
        });

        Inventory.belongsTo(Product, {
            foreignKey: 'product_id',
            targetKey: 'id_product'
        });

        // Relaciones entre Product y Category
        Product.belongsTo(Category, {
            foreignKey: 'category_id',
            targetKey: 'id_category'
        });

        Category.hasMany(Product, {
            foreignKey: 'category_id',
            sourceKey: 'id_category'
        });

        console.info("Relaciones configuradas correctamente");
    }
}