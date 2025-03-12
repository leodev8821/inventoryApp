/** 
 * @author          Leonardo Caicedo, aka Leodev
 * @fileoverview    Módulo que define y gestiona el modelo de AddressType.
 * @module          addressType.model
 */
import mongoose from "mongoose";

/**
 * Esquema de atributos del modelo AddressType.
 * @typedef {object} AddressTypeAttributes
 * @property {string} type - Tipo de dirección.
 * @property {string} abr - Abreviatura del tipo de dirección.
 */
export const addressTypeSchema = new mongoose.Schema({
    type: String,
    abr: String
});

/**
 * Modelo para el tipo de dirección.
 */
export const AddressType = mongoose.model('AddressType', addressTypeSchema, 'address-types');

/**
 * Crea un nuevo tipo de dirección.
 *
 * @async
 * @function createAddressType
 * @param {AddressTypeAttributes} data - Datos del nuevo tipo de dirección.
 * @returns {Promise<AddressTypeAttributes>} - El tipo de dirección creado.
 * @throws {Error} - Lanza un error si hay un problema al crear el tipo de dirección.
 */
export async function createAddressType(data) {
    try {
        const newAddressType = new AddressType(data);
        return await newAddressType.save();
    } catch (error) {
        console.error('Error al crear el tipo de dirección: ', error.message);
        throw new Error(`Error al crear el tipo de dirección: ${error.message}`);
    }
}

/**
 * Obtiene todos los tipos de dirección.
 *
 * @async
 * @function getAllAddressTypes
 * @returns {Promise<AddressTypeAttributes[]>} - Lista de todos los tipos de dirección.
 * @throws {Error} - Lanza un error si hay un problema al obtener los tipos de dirección.
 */
export async function getAllAddressTypes() {
    try {
        return await AddressType.find();
    } catch (error) {
        console.error('Error al obtener los tipos de dirección: ', error);
        throw new Error(`Error al obtener los tipos de dirección: ${error.message}`);
    }
}

/**
 * Obtiene un tipo de dirección por abreviatura.
 *
 * @async
 * @function getAddressTypeByEmail
 * @param {string} abr - Abreviatura del tipo de dirección a buscar.
 * @returns {Promise<AddressTypeAttributes|null>} - El tipo de dirección encontrado o null si no existe.
 * @throws {Error} - Lanza un error si hay un problema al buscar el tipo de dirección.
 */
export async function getAddressTypeByEmail(abr) {
    try {
        const addressType = await AddressType.findOne({ abr });
        return addressType ?? null;
    } catch (error) {
        console.error('Error al buscar el tipo de dirección:', error.message);
        throw new Error(`Error al buscar el tipo de dirección: ${error.message}`);
    }
}

/**
 * Actualiza un tipo de dirección por ID.
 *
 * @async
 * @function updateAddressType
 * @param {string} id - ID del tipo de dirección a actualizar.
 * @param {AddressTypeAttributes} updateData - Datos para actualizar el tipo de dirección.
 * @returns {Promise<AddressTypeAttributes|null>} - El tipo de dirección actualizado o null si no existe.
 * @throws {Error} - Lanza un error si hay un problema al actualizar el tipo de dirección.
 */
export async function updateAddressType(id, updateData) {
    try {
        const updatedaddressType = await AddressType.findByIdAndUpdate(id, updateData, { new: true });
        return updatedaddressType ?? null;
    } catch (error) {
        console.error('Error al actualizar el tipo de dirección: ', error.message);
        throw new Error(`Error al actualizar el tipo de dirección: ${error.message}`);
    }
}

/**
 * Elimina un tipo de dirección por ID.
 *
 * @async
 * @function deleteAddressType
 * @param {string} id - ID del tipo de dirección a eliminar.
 * @returns {Promise<boolean>} - `true` si el tipo de dirección fue eliminado, `false` si no se encontró.
 * @throws {Error} - Lanza un error si hay un problema al eliminar el tipo de dirección.
 */
export async function deleteAddressType(id) {
    try {
        const deletedaddressType = await AddressType.findByIdAndDelete(id);
        return deletedaddressType ? true : false;
    } catch (error) {
        console.error('Error al eliminar el tipo de dirección:', error);
        throw new Error(`Error al eliminar el tipo de dirección: ${error.message}`);
    }
}