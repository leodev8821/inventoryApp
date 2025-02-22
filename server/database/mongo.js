import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

export default {

    connectToMongo: async () => {
        // Obtener la ruta absoluta del directorio del proyecto
        const __dirname = dirname(fileURLToPath(import.meta.url));
        const envPath = join(__dirname, '../../.env'); // Subir un nivel hasta 'inventoryApp/.env'

        // Cargar el archivo .env manualmente
        dotenv.config({ path: envPath });

        // Usar variables de entorno
        const MY_DB = process.env.MONGO_DB;
        const MY_HOST = process.env.MONGO_HOST;
        const MY_PORT = parseInt(process.env.MONGO_PORT, 10) || 27017;

        // Conexión a MongoDB
        mongoose.connect(`mongodb://${MY_HOST}:${MY_PORT}/${MY_DB}`, {
        }).then(() => {
            console.log('Conexión con MongoDB establecida correctamente');
            return mongoose;
        }).catch(err => {
            console.error('Error de conexión a MongoDB:', err);
        });
    },

    closeClient: async () => {
        // Cerrar la conexión de MongoDB
        await mongoose.connection.close();
        console.log('Conexión a MongoDB cerrada');
    }
}
