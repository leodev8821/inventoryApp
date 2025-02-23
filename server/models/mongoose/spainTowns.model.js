import mongoose from "mongoose";

// Definición del esquema y modelo
export const spainTownSchema = new mongoose.Schema({
    town: String,
    province: String,
    INE_code: String
});

const spainTown = mongoose.model('Spain_Towns', spainTownSchema);

// Operaciones CRUD

// Create
export async function createTown(data) {
    try {
        const newSpainTown = new spainTown(data);
        const savedSpainTown = await newSpainTown.save();
        return savedSpainTown;
    } catch (error) {
        console.error('Error al crear población:', error);
    }
}

// Read (all spainTowns)
export async function getAllSpainTowns() {
    try {
        const spainTowns = await spainTown.find();
        return spainTowns;
    } catch (error) {
        console.error('Error al obtener Municipios:', error);
    }
}

// Read (single spainTown)
export async function getSpainTownByEmail(abr) {
    try {
        const spainTown = await spainTown.findOne({ abr });

        if (spainTown) {
            return spainTown;
        } else {
            console.log('Municipio no encontrado');
            return null;
        }
    } catch (error) {
        console.error('Error al buscar Municipio:', error);
    }
}

// Update
export async function updateSpainTown(id, updateData) {
    try {
        const updatedspainTown = await spainTown.findByIdAndUpdate(id, updateData, { new: true });
        if (updatedspainTown) {
            return updatedspainTown;
        } else {
            console.log('Municipio no encontrado');
        }
    } catch (error) {
        console.error('Error al actualizar Municipio:', error);
    }
}

// Delete
export async function deleteSpainTown(id) {
    try {
        const deletedspainTown = await spainTown.findByIdAndDelete(id);
        if (deletedspainTown) {
            return true;
        } else {
            console.log('Municipio no encontrado');
            return false;
        }
    } catch (error) {
        console.error('Error al eliminar Municipio:', error);
    }
}