import mongoose from "mongoose";


// Definición del esquema y modelo
export const addressTypeSchema = new mongoose.Schema({
    type: String,
    abr: String
});

const AddressType = mongoose.model('AddressType', addressTypeSchema, 'address-types');

// Operaciones CRUD

// Create
export async function createAddressType(data) {
    try {
        const newAddressType = new AddressType(data);
        const savedAddressType = await newAddressType.save();
        return savedAddressType;
    } catch (error) {
        console.error('Error al crear usuario:', error);
    }
}

// Read (all addressTypes)
export async function getAllAddressTypes() {
    try {
        const addressTypes = await AddressType.find();
        return addressTypes;
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
    }
}

// Read (single addressType)
export async function getAddressTypeByEmail(abr) {
    try {
        const addressType = await AddressType.findOne({ abr });

        if (addressType) {
            return addressType;
        } else {
            console.log('Usuario no encontrado');
            return null;
        }
    } catch (error) {
        console.error('Error al buscar usuario:', error);
    }
}

// Update
export async function updateAddressType(id, updateData) {
    try {
        const updatedaddressType = await AddressType.findByIdAndUpdate(id, updateData, { new: true });
        if (updatedaddressType) {
            return updatedaddressType;
        } else {
            console.log('Usuario no encontrado');
        }
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
    }
}

// Delete
export async function deleteAddressType(id) {
    try {
        const deletedaddressType = await AddressType.findByIdAndDelete(id);
        if (deletedaddressType) {
            return true;
        } else {
            console.log('Usuario no encontrado');
            return false;
        }
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
    }
}