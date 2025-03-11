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
router.get('/address/create-all-towns', address.createAllTownsAndProvinces);
router.get('/address/all-address-data', address.getAddressData);

// BBDD MySQL

//Users
router.post('/user/login', user.loginUser);
router.post('/user/create-new-user', decodeUserMiddleware, verifyPermitRoles, user.registerUser);

// Categories
router.post('/categories/new-category', decodeUserMiddleware, verifyLogin, category.newCategory);
router.get('/categories/all-categories', decodeUserMiddleware, verifyLogin, category.allCategories);

// Products
router.get('/products/all-products',decodeUserMiddleware, verifyLogin, product.allProducts);
router.post('/products/new-product', decodeUserMiddleware, verifyLogin, product.newProduct);
router.put('/products/:product_id',decodeUserMiddleware, verifyPermitRoles,  product.updateProduct);
router.get('/products/:product_id',decodeUserMiddleware, verifyPermitRoles,  product.getOneProductByID);
router.get('/products/all-products/:category_id',decodeUserMiddleware, verifyLogin,  product.allProductsByCategory);
router.delete('/products/delete/:product_id',decodeUserMiddleware, verifyPermitRoles,  product.deleteProduct);

// Roles
router.get('/roles/all-roles', decodeUserMiddleware, verifyPermitRoles, role.allRoles);

//Inventories
router.get('/inventory/all-registers', decodeUserMiddleware, verifyLogin,  inventory.allInventoryRegisters);
router.post('/inventory/create-register/:product_id', decodeUserMiddleware, verifyLogin, inventory.newRegister);
router.put('/inventory/change-quantity/:product_id', decodeUserMiddleware, verifyLogin, inventory.updateRegisterQuantity);
router.put('/inventory/delete-register/:product_id', decodeUserMiddleware, verifyLogin, inventory.deleteRegister);

export { router };