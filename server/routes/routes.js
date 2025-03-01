import { Router } from 'express';
import address from '../controllers/address.controller.js';
import user from '../controllers/users.controller.js';
import product from '../controllers/products.controller.js';
import category from '../controllers/categories.controllers.js';
import inventory from '../controllers/inventories.controller.js';
//import token from '../utils/verifyToken.js';

const router = Router();


// BBDD MongoDB
router.get('/inventory-app/v1/address/create-all-towns', address.createAllTownsAndProvinces);
router.get('/inventory-app/v1/address/all-address-data', address.getAddressData);

/* //Address
router.get('/inventory-app/v1/address/all-types', address.getTypeAddress)
router.get('/inventory-app/v1/address/all-towns', address.getTowns)
//Comms
router.get('/inventory-app/v1/comms/all-comms', comms.getComms)
router.post('/inventory-app/v1/comms/new-comm', comms.postComms)
//LOPD
router.get('/inventory-app/v1/generic/lopd', comms.lopdGet) */

// BBDD MySQL
/* 
router.get('/inventory-app/v1/user/all-users', user.allUsers);

router.post('/inventory-app/v1/user/one-user', user.oneUser); */

router.post('/inventory-app/v1/user/create-new-user', user.registerUser);
/* {
	"username" : "admin",
	"first_name" : "Leo",
	"last_names" : "Caicedo",
	"email" : "leo@admin.com",
	"pass" : "miPass1",
	"address" : "Calle Falsa 123"
}*/

router.post('/inventory-app/v1/user/login', user.loginUser);

// Categories
router.post('/inventory-app/v1/categories/new-category', category.newCategory);
router.get('/inventory-app/v1/categories/all-categories', category.allCategories);

// Products
router.post('/inventory-app/v1/products/new-product', product.newProduct);
router.get('/inventory-app/v1/products/all-products/:category_id', product.allProducts);

//Inventories
router.post('/inventory-app/v1/inventory/all-registers', inventory.allInventoryRegisters);

export { router };