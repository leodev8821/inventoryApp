import { createNewCategory, getAllCategories, getOneCategory, deleteCategory } from '../models/sequelize/category.model.js';

/* ------------- FUNCTIONS ----------------*/

export default {

    newCategory: async (req, res) => {
        try {
            const { category } = req.body;

            if (category === undefined) {
                return res.status(400).json({
                    ok: false,
                    message: 'El campo categoría es requerido.' 
                });
            }
            const newCategory = await createNewCategory({ category });

            if (!newCategory) {
                return res.status(409).json({
                    ok: false,
                    message: 'Categoría ya existe en la BD' 
                });
            }

            res.status(201).json({
                ok: true,
                message: 'Nueva categoría creada',
                data: newCategory.category
            });
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({
                ok: false,
                message: 'Error al crear la categoría.',
                error: error.message
            });
        }
    },

    allCategories: async (req, res) => {
        try {
            const categories = await getAllCategories();

            if (!categories || categories.length === 0) {
                return res.status(404).json({
                    ok: false,
                    message: 'Categorías no encontradas' 
                });
            }

            // Formatea la respuesta
            const formattedResponse = categories.map(category => ({
                id: category.id,
                category: category.category,
            }));

            res.status(200).json({
                ok: true,
                message: 'Categorías obtenidas correctamente.',
                data: formattedResponse,
            });
        } catch (error) {
            console.error('Error al obtener las categorías:', error.message);
            res.status(500).json({
				ok: false,
                message: 'Error interno al obtener las categorías.', 
                error: error.message 
            });
        }
    },

    oneCategory: async (req, res) => {
        try {
            const { category } = req.params;

            const categoryFound = await getOneCategory(category);

            if (!categoryFound) {
                return res.status(404).json({
                    ok: false,
                    message: 'Categoría no encontrada' 
                });
            }

            // Formatea la respuesta
            const resp = {
                id: categoryFound.id,
                category: categoryFound.category
            };

            res.status(200).json({
				ok: true,
                message: 'Categoría obtenida correctamente.',
                data: resp
            });
        } catch (error) {
            console.error('Error al obtener el registro de inventario:', error.message);
            res.status(500).json({
                ok: false,
                message: 'Error al obtener el registro de inventario',
                error: error.message
            });
        }
    },

    deleteCategory: async (req, res) => {
        try {
            const { category } = req.params;

            const categoryToDelete = await deleteCategory(category);

            return res.status(201).json({
				ok: true,
                message: "La categoría ha sido eliminada",
                data: categoryToDelete,
            });

        } catch (error) {
            res.status(500).json({ 
				ok: false,
                message: 'Error al eliminar la categoría',
                error: error.message
            })
        }
    }
}