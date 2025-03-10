import { createNewCategory, getAllCategories, getOneCategory, deleteCategory } from '../models/sequelize/category.model.js';

/* ------------- FUNCTIONS ----------------*/

export default {

    newCategory: async (req, res) => {
        try {
            const { category } = req.body;

            if (category === undefined) {
                return res.status(400).json({ error: 'El campo categoría es requerido.' });
            }
            const newCategory = await createNewCategory({
                category,
            });

            if (!newCategory) {
				return res.status(409).json({ message: 'Categoría ya existe en la BD' });
			}

            res.status(201).json({
                message: 'Nueva categoría creada',
                newCategory: newCategory.category
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al crear la categoría.' });
        }
    },

    allCategories: async (req, res) => {
        try {
            const categories = await getAllCategories();

            if (!categories || categories.length === 0) {
                return res.status(404).json({ message: 'Categorías no encontradas o no pertenecen al usuario.' });
            }

            // Formatea la respuesta
            const formattedResponse = categories.map(category => ({
                id: category.id,
                category: category.category,
            }));

            res.status(200).json({
                message: 'Categorías obtenidas correctamente.',
                data: formattedResponse,
            });
        } catch (error) {
            console.error('Error al obtener las categorías:', error);
            res.status(500).json({ message: 'Error interno al obtener las categorías.', error: error.message });
        }
    },

    oneCategory: async (req, res) => {
        try {
            // Extrae el id del registro de inventario desde la URL
            const { category } = req.params;

            // Llama a la función de servicio para obtener la categoría
            const categoryFound = await getOneCategory(category);

            if (!categoryFound) {
                return res.status(404).json({ message: 'Categoría no encontrada o no pertenece al usuario.' });
            }

            // Formatea la respuesta
            const resp = {
                id: categoryFound.id,
                category: categoryFound.category
            };

            res.status(200).json(resp);
        } catch (error) {
            console.error('Error al obtener el registro de inventario:', error);
            res.status(500).json({ message: 'Error al obtener el registro de inventario', error });
        }
    },

    deleteCategory: async (req, res) => {
        try {
            // Extrae el id del registro de inventario desde la URL
            const { category } = req.params;

            const categoryToDelete = await deleteCategory(category);

            return res.status(201).json({
                data: categoryToDelete,
                message: "la categoría ha sido eliminada"
            });

        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar la categoría', error })
        }
    }
}