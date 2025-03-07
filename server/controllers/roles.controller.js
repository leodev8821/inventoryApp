import { getAllRoles } from "../models/sequelize/role.model.js";
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

export default {
    allRoles: async (req, res) => {
        try {

            // Obtener la ruta absoluta del directorio del proyecto
            const __dirname = dirname(fileURLToPath(import.meta.url));
            const envPath = join(__dirname, '../../.env'); // Subir un nivel hasta 'project/.env'

            // Cargar el archivo .env manualmente
            dotenv.config({ path: envPath });

            const roleNames  ={
                1: process.env.EMPLOYED,
                2: process.env.MANAGER,
                3: process.env.ADMINISTRATOR, 
                4: process.env.SUPERUSER
            }

            const userRole = req.authData?.role;

            if (!userRole) {
                return res.status(400).json({ message: 'No se proporcionó el rol.' });
            }

            const roles = await getAllRoles(userRole);

            if (!roles || roles.length === 0) {
                return res.status(404).json({ message: 'No autorizado para mostrar roles' });
            }

            // Formatea la respuesta
            const formattedResponse = roles.map(role => ({
                id: role.id,
                role: role.role,
                roleName: roleNames[role.role] || 'N/A'
            }));
            
            res.status(200).json({
                message: 'Roles obtenidos correctamente.',
                data: formattedResponse,
            });

        } catch (error) {
            console.error('Error en allRoles:', error);
            res.status(500).json({ message: 'Error en allRoles', error: error.message });
        }
    }
}