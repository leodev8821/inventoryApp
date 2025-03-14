/** 
 * @author          Leonardo Caicedo, aka Leodev
 * @fileoverview    Módulo para cargar archivo JSON a la base de datos MySQL.
 * @module          loadUsers
 */
import { Op } from 'sequelize';
import { readFile } from 'fs/promises';
import { join } from 'path';
import {User} from '../models/sequelize/user.model.js';

/**
 * Carga usuarios desde un archivo JSON a la base de datos MySQL.
 *
 * @async
 * @function loadUsers
 * @param {string} dirname - El directorio base donde se encuentra el archivo JSON.
 * @param {string} jsonDoc - El nombre del archivo JSON que contiene los datos de los usuarios.
 * @returns {Promise<void>} Una promesa que se resuelve cuando los usuarios se cargan con éxito.
 * @throws {Error} Lanza un error si falla la lectura del archivo, el análisis JSON o la inserción en la base de datos.
 * 
 * @example
 * // Ejemplo de uso:
 * const __dirname = dirname(fileURLToPath(import.meta.url));
 * await loadUsers(__dirname, 'users.json');
 */
export const loadUsers = async (dirname, jsonDoc) => {
    try {
        // Leer archivo JSON
        const filePath = join(dirname, jsonDoc);
        const rawData = await readFile(filePath, 'utf-8');
        const usersData = JSON.parse(rawData);

        //recorrer el JSON
        for (let user of usersData) {
            //Comprobar que el usuario no existe ya
            const existingUser = await User.findOne({
                where: {
                    [Op.or]: [
                        { username: user.username },
                        { email: user.email }
                    ]
                }
            })

            if (existingUser) {
                console.warn(`❗Usuario ${user.email} ya esta creado y no se insertará`);
                continue;
            }

            // Insertar el usuario en la BD
            await User.create({
                role_id: user.role_id,
                username: user.username,
                first_name: user.first_name,
                last_names: user.last_names,
                email: user.email,
                pass: user.pass,
                address: user.address,
                isRegistered: user.isRegistered,
                isVisible: user.isVisible
            });
        }

        console.log("✅ Usuarios creados")

    } catch (error) {
        console.warn(`❌ Error al insertar usuarios ${error.message}`);
    }

}