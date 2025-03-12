/** 
 * @author          Leonardo Caicedo, aka Leodev
 * @fileoverview    Módulo que registra si la BD Mongo ya ha sido inicializada con los datos por defecto para evitar redundancia en la ejecución.
 * @module          configMongoDB
 */
import axios from 'axios';
import InitConfig from '../models/mongoose/InitConfig.model.js';
import mongoose from 'mongoose';
import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Obtener ruta del directorio actual
const __dirname = dirname(fileURLToPath(import.meta.url));

// Función para cargar tipos de dirección desde JSON
const loadAddressTypes = async () => {
    try {
        // Leer archivo JSON
        const filePath = join(__dirname, 'address-type.json');
        const rawData = await readFile(filePath, 'utf-8');
        const addressTypes = JSON.parse(rawData);

        // Mapear datos al esquema (convertir _id de string a ObjectId)
        const formattedData = addressTypes.map(({ _id, type, abr }) => ({
            _id: new mongoose.Types.ObjectId(_id?.$oid || _id),
            type,
            abr
        }));

        // Insertar en MongoDB
        await mongoose.model('AddressType').insertMany(formattedData);
        console.log('✅ Tipos de dirección cargados desde JSON');

    } catch (error) {
        console.error('❌ Error en loadAddressTypes:', error.message);
        throw error;
    }
};

/**
 * Inicializa la base de datos verificando si ya ha sido configurada previamente.
 * Si no está inicializada, ejecuta rutas específicas para llenar los documentos "address-types" y "spain-towns",
 * y marca la base de datos como inicializada.
 * 
 * @async
 * @param {string} host - Host donde se encuentra el servidor.
 * @param {number} port - Puerto donde corre el servidor.
 * @throws {Error} Si ocurre un error durante la inicialización.
 */
export const initializeDB = async (host,port) => {
    try {
        // Verificar inicialización de rutas (create-all-towns y all-address-data)
        const configRoutes = await InitConfig.findOne({ key: 'routes_initialized' });

        if (!configRoutes) {
            console.log('⚙️ Ejecutando rutas de inicialización...');
            const baseUrl = `http://${host}:${port}/inventory-app/v1`;

            await axios.get(`${baseUrl}/address/create-all-towns`);
            await axios.get(`${baseUrl}/address/all-address-data`);

            await InitConfig.create({
                key: 'routes_initialized',
                initialized: true
            });
        }

        // Verificar carga de tipos de dirección desde JSON
        const configAddressTypes = await InitConfig.findOne({ key: 'address_types_initialized' });

        if (!configAddressTypes) {
            console.log('⚙️ Cargando tipos de dirección...');
            await loadAddressTypes();

            await InitConfig.create({
                key: 'address_types_initialized',
                initialized: true
            });
        }

    } catch (error) {
        console.error('❌ Error en initializeDB:', error.message);
        throw error;
    }
};