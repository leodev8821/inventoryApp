import mongoose from "mongoose";


// Definición del esquema y modelo
export const lopdSchema = new mongoose.Schema({
    text: String
});

const Lopd = mongoose.model('Lopd', lopdSchema);

// Operaciones CRUD

// Create
export async function createlopd(data) {
    try {
        const newlopd = new Lopd(data);
        const savedlopd = await newlopd.save();
        return savedlopd;
    } catch (error) {
        console.error('Error al crear usuario:', error);
    }
}

// Read (all lopds)
export async function getAlllopds() {
    try {
        const lopds = await Lopd.find();
        return lopds;
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
    }
}

// Read (single lopd)
export async function getlopdByEmail(abr) {
    try {
        const lopd = await Lopd.findOne({ abr });

        if (lopd) {
            return lopd;
        } else {
            console.log('Usuario no encontrado');
            return null;
        }
    } catch (error) {
        console.error('Error al buscar usuario:', error);
    }
}

// Update
export async function updatelopd(id, updateData) {
    try {
        const updatedlopd = await Lopd.findByIdAndUpdate(id, updateData, { new: true });
        if (updatedlopd) {
            return updatedlopd;
        } else {
            console.log('Usuario no encontrado');
        }
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
    }
}

// Delete
export async function deletelopd(id) {
    try {
        const deletedlopd = await Lopd.findByIdAndDelete(id);
        if (deletedlopd) {
            return true;
        } else {
            console.log('Usuario no encontrado');
            return false;
        }
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
    }
}