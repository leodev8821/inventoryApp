import express, { json, urlencoded } from 'express';
import cors from 'cors';
import mysql from './database/mysql.js'
import mongo from './database/mongo.js';
import { initializeDB } from './utils/configMongoDB.js';
import cookieParser from 'cookie-parser';
import { router } from './routes/routes.js';
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Crear la aplicación de Express
const app = express()

// Middlewares
app.use(json())
app.use(urlencoded({ extended: false }))
app.use(cors())
app.use(cookieParser());

// Configurar rutas
app.use('/inventory-app/v1', router);

// Obtener la ruta absoluta del directorio del proyecto
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '../.env'); // Subir un nivel hasta 'inventoryApp/.env'

// Cargar las variables de entorno
dotenv.config({ path: envPath });

// Función para inicializar conexiones y servidor
const startServer = async () => {
    try {
        // Conectar bases de datos
        await mysql.connection();
        await mongo.connectToMongo();
        console.log('✅ Bases de datos conectadas');

        // Iniciar servidor
        const HOST = process.env.SERVER_HOST || 'localhost';
        const PORT = parseInt(process.env.SERVER_PORT, 10) || 3000;
        const server = app.listen(PORT, () => {
            console.log(`🚀 Servidor en http://${HOST}:${PORT}`);
        });

        // Esperar a que el servidor esté listo
        await new Promise((resolve, reject) => {
            server.on('listening', resolve);
            server.on('error', reject);
        });

        // Inicializar MongoDB (solo primera vez)
        await initializeDB(HOST,PORT);

    } catch (error) {
        console.error("❌ Error crítico al iniciar la aplicación:", error);
        process.exit(1); // Finalizar la aplicación si hay un error crítico
    }
};

// Iniciar la aplicación
startServer();

export default app;