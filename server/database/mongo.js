import mongoose from 'mongoose';


export default {

    connectToMongo: async () => {
        // Conexión a MongoDB
        mongoose.connect('mongodb://127.0.0.1:27017/inventoryApp', {
        }).then(() => {
            console.log('Conexión con MongoDB establecida correctamente');
            return mongoose;
        }).catch(err => {
            console.error('Error de conexión a MongoDB:', err);
        });
    },

    closeClient: async () => {
        // Cerrar la conexión de MongoDB
        await mongoose.connection.close();
        console.log('Conexión a MongoDB cerrada');
    }
}
