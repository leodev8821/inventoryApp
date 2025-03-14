import { jest } from '@jest/globals';
import { loadUsers } from "../../../utils/loadUsers.js";
import { join } from 'path';

// Mock de fs/promises con ES Modules
jest.unstable_mockModule('fs/promises', () => ({
    readFile: jest.fn()
}));

// Mock del modelo User con ES Modules
jest.unstable_mockModule('../../models/sequelize/user.model.js', () => ({
    User: {
        findOne: jest.fn(),
        create: jest.fn()
    }
}));

// Importaciones dinámicas después de los mocks
const { readFile } = await import('fs/promises');
const { User } = await import('../../../models/sequelize/user.model.js');

describe('loadUsers', () => {
    const mockDirname = '/mock/dir';
    const mockJsonDoc = 'users.json';
    const mockUsersData = [
        {
            role_id: 1,
            username: 'john_doe',
            first_name: 'John',
            last_names: 'Doe',
            email: 'john.doe@email.com',
            pass: 'miPass_1',
            address: '123 Main St, Anytown, AN 12345',
            isRegistered: true,
            isVisible: true
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('debe cargar usuarios desde un archivo JSON y guardarlos en la base de datos', async () => {
        // Configurar mocks
        readFile.mockResolvedValue(JSON.stringify(mockUsersData));
        User.findOne.mockResolvedValue(null);
        User.create.mockResolvedValue({});

        // Ejecutar función
        await loadUsers(mockDirname, mockJsonDoc);

        // Verificaciones
        expect(readFile).toHaveBeenCalledWith(
            join(mockDirname, mockJsonDoc),
            'utf-8'
        );

        expect(User.findOne).toHaveBeenCalledTimes(mockUsersData.length);
        expect(User.create).toHaveBeenCalledTimes(mockUsersData.length);

        mockUsersData.forEach(user => {
            expect(User.create).toHaveBeenCalledWith({
                role_id: user.role_id,
                username: user.username,
                first_name: user.first_name,
                last_names: user.last_names,
                email: user.email,
                pass: user.pass,
                address: user.address,
                isRegistered: user.isRegistered,
                isVisible: user.isVisible
            });
        });
    });
});