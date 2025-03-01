import tokenUtils from '../utils/tokenUtils.js';

const decodeUserMiddleware = (req, res, next) => {
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

  // Guardar el usuario decodificado en una cookie
  res.cookie('user', JSON.stringify(decodedUser), {
    httpOnly: true, // La cookie no es accesible desde el cliente vía JavaScript
    secure: process.env.NODE_ENV === 'production', // Solo se envía por HTTPS en producción
  });

  // También se puede adjuntar la información a la petición para usarla en otros middlewares o rutas
  req.user = decodedUser;

  next();
};

export default decodeUserMiddleware;
