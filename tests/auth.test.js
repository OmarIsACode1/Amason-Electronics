const request = require('supertest');

// Simular el modelo de MongoDB
jest.mock('../models/User', () => ({
    findOne: jest.fn(),
    create: jest.fn()
}));

// Simular bcrypt
jest.mock('bcryptjs', () => ({
    hash: jest.fn(),
    compare: jest.fn()
}));

// Simular JWT
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn()
}));

const app = require('../appExpress');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Preparar las pruebas
beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'secreto-de-prueba';
});

// ===================================
// PRUEBAS DE REGISTRO
// ===================================

describe('POST /api/auth/register', () => {

    test('Debe registrar un usuario correctamente', async () => {
        User.findOne.mockResolvedValue(null);
        bcrypt.hash.mockResolvedValue('password-encriptado');

        User.create.mockResolvedValue({
            _id: '123',
            nombre: 'Omar',
            correo: 'omar@test.com'
        });

        const respuesta = await request(app)
            .post('/api/auth/register')
            .send({
                nombre: 'Omar',
                correo: 'omar@test.com',
                password: '12345678'
            });

        expect(respuesta.status).toBe(201);
        expect(respuesta.body.mensaje).toBe(
            'Usuario registrado correctamente'
        );

        expect(User.create).toHaveBeenCalledWith({
            nombre: 'Omar',
            correo: 'omar@test.com',
            password: 'password-encriptado'
        });

        expect(respuesta.body.usuario).not.toHaveProperty('password');
    });

    test('No debe registrar un correo que ya existe', async () => {
        User.findOne.mockResolvedValue({
            correo: 'omar@test.com'
        });

        const respuesta = await request(app)
            .post('/api/auth/register')
            .send({
                nombre: 'Omar',
                correo: 'omar@test.com',
                password: '12345678'
            });

        expect(respuesta.status).toBe(409);
        expect(respuesta.body.mensaje).toBe(
            'El correo ya está registrado'
        );

        expect(User.create).not.toHaveBeenCalled();
    });

    test('No debe registrar un usuario con campos incompletos', async () => {
        const respuesta = await request(app)
            .post('/api/auth/register')
            .send({
                nombre: 'Omar',
                correo: 'omar@test.com'
            });

        expect(respuesta.status).toBe(400);
        expect(respuesta.body.mensaje).toBe(
            'Todos los campos son obligatorios'
        );
    });
});

// ===================================
// PRUEBAS DE INICIO DE SESIÓN
// ===================================

describe('POST /api/auth/login', () => {

    test('Debe iniciar sesión correctamente', async () => {
        User.findOne.mockResolvedValue({
            _id: '123',
            nombre: 'Omar',
            correo: 'omar@test.com',
            password: 'password-encriptado'
        });

        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue('token-de-prueba');

        const respuesta = await request(app)
            .post('/api/auth/login')
            .send({
                correo: 'omar@test.com',
                password: '12345678'
            });

        expect(respuesta.status).toBe(200);
        expect(respuesta.body.mensaje).toBe(
            'Inicio de sesión exitoso'
        );

        expect(respuesta.body.token).toBe('token-de-prueba');
        expect(respuesta.body.usuario).not.toHaveProperty('password');

        expect(jwt.sign).toHaveBeenCalled();
    });

    test('No debe iniciar sesión con una contraseña incorrecta', async () => {
        User.findOne.mockResolvedValue({
            _id: '123',
            nombre: 'Omar',
            correo: 'omar@test.com',
            password: 'password-encriptado'
        });

        bcrypt.compare.mockResolvedValue(false);

        const respuesta = await request(app)
            .post('/api/auth/login')
            .send({
                correo: 'omar@test.com',
                password: 'incorrecta'
            });

        expect(respuesta.status).toBe(401);
        expect(respuesta.body.mensaje).toBe(
            'Credenciales incorrectas'
        );

        expect(jwt.sign).not.toHaveBeenCalled();
    });

    test('No debe iniciar sesión con un usuario inexistente', async () => {
        User.findOne.mockResolvedValue(null);

        const respuesta = await request(app)
            .post('/api/auth/login')
            .send({
                correo: 'inexistente@test.com',
                password: '12345678'
            });

        expect(respuesta.status).toBe(401);
        expect(respuesta.body.mensaje).toBe(
            'Credenciales incorrectas'
        );

        expect(bcrypt.compare).not.toHaveBeenCalled();
    });
});