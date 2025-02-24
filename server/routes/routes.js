import { Router } from 'express';
//import address from '../controllers/address.controller.js';
//import comms from '../controllers/comms.controller.js';
import address from '../controllers/address.controller.js';
import user from '../controllers/users.controller.js'
//import token from '../utils/verifyToken.js';

const router = Router();


// BBDD MongoDB
router.get('/inventory-app/v1/address/create-all-towns', address.createAllTownsAndProvinces);
router.get('/inventory-app/v1/address/all-provinces', address.getProvinces);
router.get('/inventory-app/v1/address/all-towns', address.getTowns);
router.get('/inventory-app/v1/address/all-address-type', address.getAddressType);

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

//router.post('/inventory-app/v1/user/update-pass', user.updatePass);

//Funcionalidad confirmar nuevo correo funcional
//router.post('/inventory-app/v1/user/confirm-pass/:token', user.confirmPass);

export { router };