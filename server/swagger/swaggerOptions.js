// swaggerOptions.js
import swaggerJsDoc from "swagger-jsdoc";
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Obtener la ruta absoluta del directorio del proyecto
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '../../.env'); // Subir un nivel hasta 'inventoryApp/.env'

// Cargar las variables de entorno
dotenv.config({ path: envPath });
const HOST = process.env.SERVER_HOST || 'localhost';
const PORT = parseInt(process.env.SERVER_PORT, 10) || 3001;

const swaggerOptions = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "API InventoryApp",
            version: "1.0.0",
            description: `
                Documentación de la API InventoryApp con Swagger.
                Puedes probar los endpoints en el entorno de desarrollo.
                
                Links al repositorio GitHub:
                - [Backend](https://github.com/leodev8821/inventoryApp/tree/develop/server)
            `,
            contact: {
                name: "Leonardo Caicedo aka LeoDev",
                url: "https://github.com/leodev8821",
            }
        },
        servers: [
            {
                url: `http://${HOST}:${PORT}/inventory-app/v1`,
                description: "Servidor de desarrollo",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                }
            },
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        id: { type: "integer", format: "int64", example: 1 },
                        username: { type: "string", example: "johndoe" },
                        email: { type: "string", example: "user@example.com" },
                        role: { type: "string", example: "admin" },
                        first_name: { type: "string", example: "John" },
                        last_name: { type: "string", example: "Doe Smith" }
                    },
                    required: ["id", "username", "email", "role", "first_name", "last_name"]
                },
                UserInput: {
                    type: "object",
                    properties: {
                        login_data: { type: "string", description: "Email o nombre de usuario", example: "user@example.com" },
                        password: { type: "string", format: "password", example: "SecurePassword123" }
                    },
                    required: ["login_data", "password"]
                },
                UserOutput: {
                    type: "object",
                    properties: {
                        id: { type: "integer", format: "int64" },
                        username: { type: "string" },
                        email: { type: "string" }
                    }
                },
                Token: {
                    type: "object",
                    properties: {
                        ok: { type: "boolean", example: true },
                        message: { type: "string", example: "Token generado exitosamente" },
                        token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
                        user: { $ref: "#/components/schemas/User" }
                    }
                },
                Error: {
                    type: "object",
                    properties: {
                        ok: { type: "boolean", example: false },
                        error: { type: "string" }
                    }
                }
            }
        }
    },
    apis: ["./routes/*.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
export default swaggerDocs;