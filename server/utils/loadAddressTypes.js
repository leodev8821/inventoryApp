/** 
 * @author          Leonardo Caicedo, aka Leodev
 * @fileoverview    Módulo para cargar archivo JSON a la base de datos MongoDB.
 * @module          loadAddressTypes
 */
import mongoose from 'mongoose';
import { readFile } from 'fs/promises';
import { join } from 'path';

/**
 * Carga tipos de dirección desde un archivo JSON a la base de datos MongoDB.
 *
 * @async
 * @function loadAddressTypes
 * @param {string} dirname - El directorio base donde se encuentra el archivo JSON.
 * @param {string} jsonDoc - El nombre del archivo JSON que contiene los tipos de dirección.
 * @throws {Error} Lanza un error si falla la lectura del archivo, el análisis JSON o la inserción en MongoDB.
 * @returns {Promise<void>} Una promesa que se resuelve cuando los tipos de dirección se cargan con éxito.
 */
export const loadAddressTypes = async (dirname, jsonDoc) => {
    try {
        // Leer archivo JSON
        const filePath = join(dirname, jsonDoc);
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