import { Router } from 'express';
import decodeUserMiddleware from '../middlewares/decodeUser.js';
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
router.post('/inventory-app/v1/user/create-new-user', decodeUserMiddleware, user.registerUser);

// Categories
router.post('/inventory-app/v1/categories/new-category', decodeUserMiddleware, category.newCategory);
router.get('/inventory-app/v1/categories/all-categories', decodeUserMiddleware, category.allCategories);

// Products
router.post('/inventory-app/v1/products/new-product', decodeUserMiddleware, product.newProduct);
router.get('/inventory-app/v1/products/all-products/:category_id',decodeUserMiddleware, product.allProductsByCategory);
router.get('/inventory-app/v1/products/all-products',decodeUserMiddleware, product.allProducts);

// Roles
router.get('/inventory-app/v1/roles/all-roles', decodeUserMiddleware, role.allRoles);

//Inventories
router.post('/inventory-app/v1/inventory/all-registers', inventory.allInventoryRegisters);

export { router };