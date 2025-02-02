import { Router } from 'express';
import address from '../controllers/address.controller.js';
import comms from '../controllers/comms.controller.js';
import user from '../controllers/user.controller.js'
import token from '../utils/verifyToken.js';

const router = Router();


// BBDD MongoDB
//Address
router.get('/trainingpro/v1/address/all-types', address.getTypeAddress)
router.get('/trainingpro/v1/address/all-towns', address.getTowns)
//Comms
router.get('/trainingpro/v1/comms/all-comms', comms.getComms)
router.post('/trainingpro/v1/comms/new-comm', comms.postComms)
//LOPD
router.get('/trainingpro/v1/generic/lopd', comms.lopdGet)

// BBDD MySQL
router.post('/trainingpro/v1/user/login', user.loginUser);
//KAN-35
router.get('/trainingpro/v1/user/all-users', user.allUsers);
//KAN-28
//router.post('/trainingpro/v1/user/update-pass', user.updatePass);

//Funcionalidad confirmar nuevo correo funcional
//router.post('/trainingpro/v1/user/confirm-pass/:token', user.confirmPass);

export { router };