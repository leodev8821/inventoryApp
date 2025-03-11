import { Router } from 'express';
import { decodeUserMiddleware, verifyPermitRoles, verifyLogin } from '../middlewares/decodeUser.js';
import address from '../controllers/address.controller.js';
import role from '../controllers/roles.controller.js';
import user from '../controllers/users.controller.js';
import product from '../controllers/products.controller.js';
import category from '../controllers/categories.controllers.js';
import inventory from '../controllers/inventories.controller.js';
//import token from '../utils/verifyToken.js';

const router = Router();


// BBDD MongoDB
router.get('/inventory-app/v1/address/create-all-towns', address.createAllTownsAndProvinces);
router.get('/inventory-app/v1/address/all-address-data', address.getAddressData);

/* 
//LOPD
router.get('/inventory-app/v1/generic/lopd', comms.lopdGet) */

// BBDD MySQL

//Users
router.post('/inventory-app/v1/user/login', user.loginUser);
router.post('/inventory-app/v1/user/create-new-user', decodeUserMiddleware, verifyPermitRoles, user.registerUser);

// Categories
router.post('/inventory-app/v1/categories/new-category', decodeUserMiddleware, verifyLogin, category.newCategory);
router.get('/inventory-app/v1/categories/all-categories', decodeUserMiddleware, verifyLogin, category.allCategories);

// Products
router.post('/inventory-app/v1/products/new-product', decodeUserMiddleware, verifyLogin, product.newProduct);
router.get('/inventory-app/v1/products/all-products/:category_id',decodeUserMiddleware, verifyLogin,  product.allProductsByCategory);
router.get('/inventory-app/v1/products/all-products',decodeUserMiddleware, verifyLogin, product.allProducts);
router.put('/inventory-app/v1/products/:product_id',decodeUserMiddleware, verifyPermitRoles,  product.updateProduct);
router.delete('/inventory-app/v1/products/:product_id',decodeUserMiddleware, verifyPermitRoles,  product.deleteProduct);

// Roles
router.get('/inventory-app/v1/roles/all-roles', decodeUserMiddleware, verifyPermitRoles, role.allRoles);

//Inventories
router.post('/inventory-app/v1/inventory/create-register/:product_id', decodeUserMiddleware, inventory.newRegister);
router.post('/inventory-app/v1/inventory/all-registers', inventory.allInventoryRegisters);

export { router };