const request = require('supertest');
const express = require('express');
// Importar rutas y dependencias mocked
const apiRoutes = require('../../src/routes/apiRoutes');
const db = require('../../src/db');
const authMiddleware = require('../../src/middleware/authMiddleware');

// Mockear DB y Auth Middleware
jest.mock('../../src/db');
jest.mock('../../src/middleware/authMiddleware');

// Crear una app Express aislada para testing (evita levantar el servidor real de app.js)
const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

describe('Integration Tests: /api/mascotas', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock del middleware de autenticación para simular un usuario logueado
        authMiddleware.mockImplementation((req, res, next) => {
            req.userId = 1; // ID de usuario simulado
            next();
        });
    });

    describe('POST /api/mascotas', () => {
        it('debería crear una mascota correctamente', async () => {
            // Mock de la inserción en BD
            db.query.mockResolvedValue([{ insertId: 100 }, null]);

            const newPet = {
                nombre: 'Luna',
                tipo: 'Gato',
                raza: 'Persa',
                edad: 4,
                peso: 5,
                foto: 'luna.jpg'
            };

            const response = await request(app)
                .post('/api/mascotas')
                .send(newPet);

            // Validar respuesta HTTP
            expect(response.statusCode).toBe(201);
            expect(response.body).toEqual({
                success: true,
                message: 'Mascota agregada'
            });

            // Validar que se llamó a la BD con los datos correctos
            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO mascotas'),
                [1, 'Luna', 'Gato', 'Persa', 4, 5, 'luna.jpg']
            );
        });

        it('debería manejar errores de servidor', async () => {
            // Simular fallo en BD
            db.query.mockRejectedValue(new Error('DB Error'));

            const response = await request(app)
                .post('/api/mascotas')
                .send({ nombre: 'ErrorPet' });

            // En tests solemos mutear el console.error esperado
            // Para ver el output limpio, aunque aquí no lo mockeo para brevedad.

            expect(response.statusCode).toBe(500);
            expect(response.body).toHaveProperty('error');
        });
    });

    describe('GET /api/mascotas', () => {
        it('debería obtener la lista de mascotas', async () => {
            const mockPets = [{ id: 1, nombre: 'Rocky' }];
            db.query.mockResolvedValue([mockPets, null]);

            const response = await request(app).get('/api/mascotas');

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(mockPets);
        });
    });
});
