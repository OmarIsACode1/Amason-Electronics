const request = require('supertest');

// Simular el modelo de MongoDB
jest.mock('../models/Product', () => ({
    create: jest.fn(),
    find: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn()
}));

// Simular la verificación del JWT
jest.mock('jsonwebtoken', () => ({
    verify: jest.fn()
}));

const app = require('../appExpress');
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');

const usuarioId = 'usuario-123';
const productoId = 'producto-456';
const token = 'token-de-prueba';

// Preparar las pruebas
beforeEach(() => {
    jest.clearAllMocks();

    // Simular un token válido
    jwt.verify.mockReturnValue({
        id: usuarioId
    });
});

// ===================================
// PRUEBAS DE CREACIÓN
// ===================================

describe('POST /api/products', () => {

    test('Debe registrar un producto correctamente', async () => {
        Product.create.mockResolvedValue({
            _id: productoId,
            nombre: 'Laptop',
            descripcion: 'Laptop de prueba',
            precio: 15000,
            existencias: 5,
            usuario: usuarioId
        });

        const respuesta = await request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nombre: 'Laptop',
                descripcion: 'Laptop de prueba',
                precio: 15000,
                existencias: 5
            });

        expect(respuesta.status).toBe(201);
        expect(respuesta.body.mensaje).toBe(
            'Producto registrado correctamente'
        );

        expect(Product.create).toHaveBeenCalledWith({
            nombre: 'Laptop',
            descripcion: 'Laptop de prueba',
            precio: 15000,
            existencias: 5,
            usuario: usuarioId
        });
    });

    test('No debe registrar un producto con campos incompletos', async () => {
        const respuesta = await request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nombre: 'Laptop',
                descripcion: 'Laptop de prueba'
            });

        expect(respuesta.status).toBe(400);
        expect(respuesta.body.mensaje).toBe(
            'Todos los campos son obligatorios'
        );

        expect(Product.create).not.toHaveBeenCalled();
    });
});

// ===================================
// PRUEBAS DE CONSULTA
// ===================================

describe('GET /api/products', () => {

    test('Debe consultar los productos del usuario autenticado', async () => {
        Product.find.mockResolvedValue([
            {
                _id: productoId,
                nombre: 'Laptop',
                descripcion: 'Laptop de prueba',
                precio: 15000,
                existencias: 5,
                usuario: usuarioId
            }
        ]);

        const respuesta = await request(app)
            .get('/api/products')
            .set('Authorization', `Bearer ${token}`);

        expect(respuesta.status).toBe(200);
        expect(respuesta.body.mensaje).toBe(
            'Productos obtenidos correctamente'
        );

        expect(respuesta.body.productos).toHaveLength(1);

        expect(Product.find).toHaveBeenCalledWith({
            usuario: usuarioId
        });
    });
});

// ===================================
// PRUEBAS DE ACTUALIZACIÓN
// ===================================

describe('PUT /api/products/:id', () => {

    test('Debe actualizar un producto correctamente', async () => {
        Product.findOneAndUpdate.mockResolvedValue({
            _id: productoId,
            nombre: 'Laptop actualizada',
            descripcion: 'Nueva descripción',
            precio: 18000,
            existencias: 8,
            usuario: usuarioId
        });

        const respuesta = await request(app)
            .put(`/api/products/${productoId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                nombre: 'Laptop actualizada',
                descripcion: 'Nueva descripción',
                precio: 18000,
                existencias: 8
            });

        expect(respuesta.status).toBe(200);
        expect(respuesta.body.mensaje).toBe(
            'Producto actualizado correctamente'
        );

        expect(Product.findOneAndUpdate).toHaveBeenCalledWith(
            {
                _id: productoId,
                usuario: usuarioId
            },
            {
                nombre: 'Laptop actualizada',
                descripcion: 'Nueva descripción',
                precio: 18000,
                existencias: 8
            },
            {
                new: true,
                runValidators: true
            }
        );
    });

    test('No debe actualizar un producto inexistente o ajeno', async () => {
        Product.findOneAndUpdate.mockResolvedValue(null);

        const respuesta = await request(app)
            .put(`/api/products/${productoId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                nombre: 'Laptop actualizada',
                descripcion: 'Nueva descripción',
                precio: 18000,
                existencias: 8
            });

        expect(respuesta.status).toBe(404);
        expect(respuesta.body.mensaje).toBe(
            'Producto no encontrado o no tienes permiso para modificarlo'
        );
    });
});

// ===================================
// PRUEBAS DE ELIMINACIÓN
// ===================================

describe('DELETE /api/products/:id', () => {

    test('Debe eliminar un producto correctamente', async () => {
        Product.findOneAndDelete.mockResolvedValue({
            _id: productoId,
            nombre: 'Laptop',
            usuario: usuarioId
        });

        const respuesta = await request(app)
            .delete(`/api/products/${productoId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(respuesta.status).toBe(200);
        expect(respuesta.body.mensaje).toBe(
            'Producto eliminado correctamente'
        );

        expect(Product.findOneAndDelete).toHaveBeenCalledWith({
            _id: productoId,
            usuario: usuarioId
        });
    });
});

// ===================================
// PRUEBAS DE AUTENTICACIÓN
// ===================================

describe('Protección de rutas de productos', () => {

    test('Debe rechazar solicitudes sin token', async () => {
        const respuesta = await request(app)
            .get('/api/products');

        expect(respuesta.status).toBe(401);
        expect(respuesta.body.mensaje).toBe(
            'Acceso denegado. No se proporcionó un token.'
        );

        expect(Product.find).not.toHaveBeenCalled();
    });
});