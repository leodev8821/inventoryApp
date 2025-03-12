/** 
 * @author          Leonardo Caicedo, aka Leodev
 * @fileoverview    Módulo que define y gestiona el modelo de SpainTown.
 * @module          spainTowns.model
 */
import mongoose from "mongoose";

/**
 * Esquema para el municipio español.
 * 
 * @typedef {object} SpainTownAttributes
 * @property {string} town - Nombre del municipio.
 * @property {string} province - Nombre de la provincia.
 * @property {string} INE_code - Código INE del municipio.
 */
export const spainTownSchema = new mongoose.Schema({
    town: String,
    province: String,
    INE_code: String
});

/**
 * Modelo para el municipio español.
 */
const spainTown = mongoose.model('Spain_Towns', spainTownSchema);

/**
 * Crea un nuevo municipio español.
 *
 * @async
 * @function createTown
 * @param {SpainTownAttributes} data - Datos del nuevo municipio.
 * @returns {Promise<SpainTownAttributes>} - El municipio creado.
 * @throws {Error} - Lanza un error si hay un problema al crear el municipio.
 */
export async function createTown(data) {
    try {
        const newSpainTown = new spainTown(data);
        return await newSpainTown.save();
    } catch (error) {
        console.error('Error al crear la población:', error.message);
        throw new Error(`Error al crear la población: ${error.message}`);
    }
}

/**
 * Obtiene todos los municipios españoles.
 *
 * @async
 * @function getAllSpainTowns
 * @returns {Promise<SpainTownAttributes[]>} - Lista de todos los municipios.
 * @throws {Error} - Lanza un error si hay un problema al obtener los municipios.
 */
export async function getAllSpainTowns() {
    try {
        return await spainTown.find();
    } catch (error) {
        console.error('Error al obtener Municipios:', error.message);
        throw new Error(`Error al obtener Municipios: ${error.message}`);
    }
}

/**
 * Obtiene un municipio español por abreviatura.
 *
 * @async
 * @function getSpainTownByEmail
 * @param {string} abr - Abreviatura del municipio a buscar.
 * @returns {Promise<SpainTownAttributes|null>} - El municipio encontrado o null si no existe.
 * @throws {Error} - Lanza un error si hay un problema al buscar el municipio.
 */
export async function getSpainTownByEmail(abr) {
    try {
        const spainTown = await spainTown.findOne({ abr });
        return spainTown ?? null;
    } catch (error) {
        console.error('Error al buscar Municipio:', error.message);
        throw new Error(`Error al buscar Municipio: ${error.message}`);
    }
}

/**
 * Actualiza un municipio español por ID.
 *
 * @async
 * @function updateSpainTown
 * @param {string} id - ID del municipio a actualizar.
 * @param {SpainTownAttributes} updateData - Datos para actualizar el municipio.
 * @returns {Promise<SpainTownAttributes|null>} - El municipio actualizado o null si no existe.
 * @throws {Error} - Lanza un error si hay un problema al actualizar el municipio.
 */
export async function updateSpainTown(id, updateData) {
    try {
        const updatedspainTown = await spainTown.findByIdAndUpdate(id, updateData, { new: true });
        return updatedspainTown ?? null;
    } catch (error) {
        console.error('Error al actualizar Municipio:', error.message);
        throw new Error(`Error al actualizar Municipio: ${error.message}`);
    }
}

/**
 * Elimina un municipio español por ID.
 *
 * @async
 * @function deleteSpainTown
 * @param {string} id - ID del municipio a eliminar.
 * @returns {Promise<boolean>} - `true` si el municipio fue eliminado, `false` si no se encontró.
 * @throws {Error} - Lanza un error si hay un problema al eliminar el municipio.
 */
export async function deleteSpainTown(id) {
    try {
        const deletedSpainTown = await spainTown.findByIdAndDelete(id);
        return deletedSpainTown ? true : false;
    } catch (error) {
        console.error('Error al eliminar Municipio:', error.message);
        throw new Error(`Error al eliminar Municipio: ${error.message}`);
    }
}