import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Obtener la ruta absoluta del directorio del proyecto
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '../../.env'); // Subir un nivel hasta 'inventoryApp/.env'

// Cargar las variables de entorno
dotenv.config({ path: envPath });

export default {

    /**
     * Conecta a la base de datos MongoDB.
     * @async
     * @throws {Error} Si ocurre un error en la conexión a la base de datos.
     */
    connectToMongo: async () => {
        try {
            // Usar variables de entorno
            const MY_DB = process.env.MONGO_DB;
            const MY_HOST = process.env.MONGO_HOST;
            const MY_PORT = parseInt(process.env.MONGO_PORT, 10) || 27017;

            // Conexión a MongoDB
            await mongoose.connect(`mongodb://${MY_HOST}:${MY_PORT}/${MY_DB}`, {});

            console.log('✅ MongoDB conectado');

            /* 
            .then(() => {
                console.log('Conexión con MongoDB establecida correctamente');
                return mongoose;
            }).catch(err => {
                console.error('Error de conexión a MongoDB:', err);
            });
            */
        } catch (error) {
            console.error('❌ Error de conexión a MongoDB:', err);
            throw error;
        }
    },

    /**
     * Cierra la conexión a la base de datos MongoDB.
     * @async
     */
    closeClient: async () => {
        await mongoose.connection.close();
        console.log('🔌 Conexión a MongoDB cerrada');
    }
}
