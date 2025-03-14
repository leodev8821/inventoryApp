import { Router } from 'express';
import { decodeUserMiddleware, verifyPermitRoles, verifyLogin } from '../middlewares/decodeUser.js';
import address from '../controllers/address.controller.js';
import role from '../controllers/roles.controller.js';
import user from '../controllers/users.controller.js';
import product from '../controllers/products.controller.js';
import category from '../controllers/categories.controllers.js';
import inventory from '../controllers/inventories.controller.js';

const router = Router();


// BBDD MongoDB
router.get('/address/create-all-towns', address.createAllTownsAndProvinces);
router.get('/address/all-address-data', address.getAddressData);

// BBDD MySQL

/** -------------------- USERS ------------------------------------------------ */
/**
 * @swagger
 * /user/login:
 *   post:
 *     tags:
 *       - Users
 *     summary: Inicia sesión de usuario y genera token JWT
 *     description: >
 *       Autentica al usuario usando email/username y contraseña.
 *       Devuelve un token JWT para autenticación en siguientes requests.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login_data
 *               - password
 *             properties:
 *               login_data:
 *                 type: string
 *                 description: Email o nombre de usuario
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "SecurePassword123"
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Token generado exitosamente"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Credenciales faltantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Faltan credenciales"
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Credenciales incorrectas"
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Usuario no encontrado."
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error en loginUser"
 *                 error:
 *                   type: string
 *                   example: "Mensaje de error detallado"
 *     security: []
 */
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
router.put('/inventory/change-quantity/:product_id', decodeUserMiddleware, verifyLogin, inventory.updateRegisterQuantity);
router.put('/inventory/delete-register/:product_id', decodeUserMiddleware, verifyLogin, inventory.deleteRegister);

export { router };