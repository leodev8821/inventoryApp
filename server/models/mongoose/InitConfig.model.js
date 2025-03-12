/** 
 * @author          Leonardo Caicedo, aka Leodev
 * @fileoverview    Módulo que define y gestiona el modelo de InitConfig.
 * @module          initConfig.model
 */
import mongoose from "mongoose";

/**
 * Esquema para gestionar la configuración de inicialización de la base de datos.
 * Este esquema permite registrar diferentes estados de inicialización.
 * 
 * @typedef {Object} InitConfigSchema
 * @property {string} key - Clave única que indica el estado de inicialización.
 * Puede tomar valores como 'routes_initialized' o 'address_types_initialized'.
 * @property {boolean} initialized - Indica si la configuración ha sido inicializada.
 * @property {Date} date - Fecha de creación del registro.
 */
const InitSchema = new mongoose.Schema({
    key: {
        type: String,
        unique: true,
        required: true,
        enum: ['routes_initialized', 'address_types_initialized']
    },
    initialized: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Modelo Mongoose basado en el esquema
const InitConfig = mongoose.model('InitConfig', InitSchema);

export default InitConfig;