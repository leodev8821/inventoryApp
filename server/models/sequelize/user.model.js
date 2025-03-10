import { DataTypes, Op } from 'sequelize';
import bcrypt from 'bcryptjs';
import { getSequelizeConf } from '../../database/mysql.js';
import { Role } from './role.model.js';

const connection = getSequelizeConf();

// Definición del modelo User
export const User = connection.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'roles',
            key: 'id'       
        }
    },
    username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    first_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    last_names: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    pass: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    isRegistered: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    isVisible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
}, {
    tableName: 'users',
    timestamps: false,
    hooks: { // Añade la sección de hooks
        beforeValidate: async (user) => { // Hook beforeValidate que se ejecuta antes de validar el modelo
            if (user.changed('pass')) { // Verifica si el campo 'pass' ha sido modificado
                const saltRounds = 10; // Número de rondas de hashing (ajusta según seguridad vs. rendimiento)
                const hashedPassword = await bcrypt.hash(user.pass, saltRounds); // Hashea la contraseña de forma asíncrona
                user.pass = hashedPassword; // Reemplaza la contraseña en texto plano con el hash
            }
        }
    }
});

/**
 * Relación: Una Usuario pertenece a un rol.
 *
 * @description Establece la relación "belongsTo" entre Role y User, usando 'role_id' como clave foránea.
 * @see {@link User}
 */
User.belongsTo(Role, { foreignKey: 'role_id' });

/**
 * Relación: Un rol tiene muchos usuarios.
 *
 * @description Establece la relación "hasMany" entre User y Role, usando 'role_id' como clave foránea.
 * @see {@link Role}
 */
Role.hasMany(User, { foreignKey: 'role_id', onDelete: 'CASCADE' });

// CRUD Operations
/**
     * Create a new user
     * @param {*} data -> new user data
     * @returns newUser -> New user created
     */
export async function createNewUser(data) {
    try {
        const loginData = ["username", "email"];
        const user = await User.findOne({
            where: {
                [Op.or]: loginData.map((field) => ({ [field]: data[field] }))
            }
        });
        if (user) {
            return null;
        }
        const newUser = await User.create(data);
        return newUser.dataValues;
    } catch (error) {
        console.error('Error al crear Usuario:', error);
    }
};

/**
 * Read (all users)
 * @returns -> listado de Usuarios
 */
export async function getAllUsers() {
    try {
        return await User.findAll();
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        throw new Error('Error al consultar la base de datos.');
    }
};

/**
 * Buscar un Usuario por username o email
 * @param data -> username o email
 * @returns user -> usuario encontrado
 */
export async function getOneUser(data) {
    try {
        const fields = ["username", "email"];
        const searchValue = data.trim();
        const user = await User.findOne({
            where: {
                [Op.and]: [
                    { isVisible: 1 }
                ],
                [Op.or]: fields.map((field) => ({ [field]: searchValue }))
            }
        });
        if (!user) {
            return null;
        }
        return user.dataValues;
    } catch (error) {
        console.error(`Error al buscar usuario con username o email "${data}":`, error.message);
        throw new Error('Error al consultar la base de datos.');
    }
};

/**
 * Update one user
 * @param {String} userInfo -> username or email
 * @param  newData -> data to be update
 * @returns  user -> User updated
 */
export async function updateOneUser(userInfo, newData) {
    try {
        const user = await User.findOne({
            where: {
                [Op.or]: userInfo.map((field) => ({ [field]: data[field] }))
            }
        });
        if (!user) {
            return null;
        }
        await User.update(newData, {
            where: {
                [Op.or]: userInfo.map((field) => ({ [field]: data[field] }))
            }
        });
        return user.dataValues;
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        throw new Error('Error al actualizar usuario');
    }
}

/**
 * Delete (set isVisible = 0) an user
 * @param {*} userInfo -> username or email from user
 * @returns  user -> user modified (deleted)
 */
export async function deleteUser(userInfo) {
    try {
        const user = await User.findOne({
            where: {
                [Op.or]: userInfo.map((field) => ({ [field]: data[field] }))
            }
        });
        if (!user) {
            return null;
        }
        user.isVisible = false;
        await user.save();
        return user;
    } catch (error) {
        console.error(`Error al eliminar el usuario ${userInfo}`, error);
        throw new Error('Error al eliminar el Usuario');
    }
};