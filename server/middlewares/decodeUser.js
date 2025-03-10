import tokenUtils from '../utils/tokenUtils.js';
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Obtener la ruta absoluta del directorio del proyecto
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '../../.env'); // Subir un nivel hasta 'inventoryApp/.env'

// Cargar el archivo .env manualmente
dotenv.config({ path: envPath });

// Usar variables de entorno
const allowedRoles = process.env.ALLOWED_ROLES.split(',').map(Number);
const managerRole = parseInt(process.env.MANAGER_ROLE);

export const decodeUserMiddleware = (req, res, next) => {
  // Extraer el token del header de autorización (se asume el formato "Bearer <token>")
  const bearerHeader = req.headers['authorization'];

  if (!bearerHeader || !bearerHeader.trim()) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = bearerHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Formato de token incorrecto' });
  }

  // Decodificar el token usando la función definida en tokenUtils
  const decodedUser = tokenUtils.decodeToken(token);

  if (!decodedUser) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }

  req.email = decodedUser.email;
  req.role_id = decodedUser.role;
  req.username = decodedUser.username;
  req.userId = decodedUser.id;
  next();
};

export const verifyLogin = (req, res, next) => {
  if(req.username && req.userId){
    return next();
  }

  return res.status(403).json({ error: "You need to log in"})

}

export const verifyPermitRoles = (req, res, next) => {
  const userRole = req.role_id;
  if(allowedRoles.includes(userRole)){
    return next();
  }

  return res.status(403).json({ error: "Unauthorized user"})

}

export const verifyManagerUser = (req, res, next) => {
  const userRole = req.role_id;
  if(userRole === managerRole){
    return next();
  }

  return res.status(403).json({ error: "Unauthorized! Only manager"})

}
