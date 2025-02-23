import mongoose from "mongoose";

// Definición del esquema y modelo
export const spainProvinceSchema = new mongoose.Schema({
    province: String,
    INE_code: String
});

const spainProvince = mongoose.model('Spain_Provinces', spainProvinceSchema);

// Operaciones CRUD

// Create
export async function createProvince(data) {
    try {
        const newSpainProvince = new spainProvince(data);
        const savedSpainProvince = await newSpainProvince.save();
        return savedSpainProvince;
    } catch (error) {
        console.error('Error al crear Provincia:', error);
    }
}

// Read (all spainProvinces)
export async function getAllSpainProvinces() {
    try {
        const spainProvinces = await spainProvince.find();
        return spainProvinces;
    } catch (error) {
        console.error('Error al obtener Provincias:', error);
    }
}

// Read (single spainProvince)
export async function getSpainProvinceByEmail(abr) {
    try {
        const spainProvince = await spainProvince.findOne({ abr });

        if (spainProvince) {
            return spainProvince;
        } else {
            console.log('Provincia no encontrado');
            return null;
        }
    } catch (error) {
        console.error('Error al buscar Provincia:', error);
    }
}

// Update
export async function updateSpainProvince(id, updateData) {
    try {
        const updatedspainProvince = await spainProvince.findByIdAndUpdate(id, updateData, { new: true });
        if (updatedspainProvince) {
            return updatedspainProvince;
        } else {
            console.log('Provincia no encontrado');
        }
    } catch (error) {
        console.error('Error al actualizar Provincia:', error);
    }
}

// Delete
export async function deleteSpainProvince(id) {
    try {
        const deletedspainProvince = await spainProvince.findByIdAndDelete(id);
        if (deletedspainProvince) {
            return true;
        } else {
            console.log('Provincia no encontrado');
            return false;
        }
    } catch (error) {
        console.error('Error al eliminar Provincia:', error);
    }
}