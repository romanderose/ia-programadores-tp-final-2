const mascotasController = require('../../src/controllers/mascotasController');
const db = require('../../src/db');

// Mockear el módulo de base de datos
jest.mock('../../src/db');

describe('Mascotas Controller Only Unit Tests', () => {
    let req, res;

    beforeEach(() => {
        jest.clearAllMocks();
        req = {
            userId: 1,
            body: {},
            params: {}
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    describe('getAll', () => {
        it('debería devolver una lista de mascotas para el usuario', async () => {
            const mockMascotas = [{ id: 1, nombre: 'Fido', usuario_id: 1 }];
            // db.query devuelve [rows, fields]
            db.query.mockResolvedValue([mockMascotas, null]);

            await mascotasController.getAll(req, res);

            expect(db.query).toHaveBeenCalledTimes(1);
            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT * FROM mascotas'),
                expect.arrayContaining([req.userId])
            );
            expect(res.json).toHaveBeenCalledWith(mockMascotas);
        });

        it('debería manejar errores de la base de datos', async () => {
            const error = new Error('Database connection failed');
            db.query.mockRejectedValue(error);
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

            await mascotasController.getAll(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error al obtener mascotas' });
            consoleSpy.mockRestore();
        });
    });

    describe('create', () => {
        it('debería crear una mascota exitosamente', async () => {
            req.body = {
                nombre: 'Rex',
                tipo: 'Perro',
                raza: 'Ovejero',
                edad: 5,
                peso: 20,
                foto: 'url_foto'
            };
            db.query.mockResolvedValue([{ insertId: 10 }, null]);

            await mascotasController.create(req, res);

            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO mascotas'),
                [req.userId, 'Rex', 'Perro', 'Ovejero', 5, 20, 'url_foto']
            );
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Mascota agregada' });
        });

        it('debería manejar errores al crear', async () => {
            db.query.mockRejectedValue(new Error('Insert failed'));
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

            await mascotasController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error al agregar mascota' });
            consoleSpy.mockRestore();
        });
    });

    describe('delete', () => {
        it('debería eliminar una mascota existente', async () => {
            req.params.id = 10;
            db.query.mockResolvedValue([{ affectedRows: 1 }, null]);

            await mascotasController.delete(req, res);

            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('DELETE FROM mascotas'),
                [10, req.userId]
            );
            expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Mascota eliminada' });
        });

        it('debería manejar errores al eliminar', async () => {
            db.query.mockRejectedValue(new Error('Delete error'));
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

            await mascotasController.delete(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error al eliminar mascota' });
            consoleSpy.mockRestore();
        });
    });

    describe('update', () => {
        it('debería actualizar una mascota existente', async () => {
            req.params.id = 10;
            req.body = { nombre: 'Rex Updated' };
            db.query.mockResolvedValue([{ affectedRows: 1 }, null]);

            await mascotasController.update(req, res);

            expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Mascota actualizada' });
        });

        it('debería retonar 404 si la mascota no existe', async () => {
            req.params.id = 999;
            req.body = { nombre: 'Fantasma' };
            db.query.mockResolvedValue([{ affectedRows: 0 }, null]);

            await mascotasController.update(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Mascota no encontrada o no autorizada' });
        });

        it('debería manejar errores al actualizar', async () => {
            db.query.mockRejectedValue(new Error('Update error'));
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

            await mascotasController.update(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error al actualizar mascota' });
            consoleSpy.mockRestore();
        });
    });
});
