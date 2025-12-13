import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js'; 
import { connectDB } from '../src/db.js'; 
import { User } from '../src/repositories/users.js'; 
import { logAction } from '../utils/logger.js'; 
import { authMiddleware } from '../src/middleware/auth.js'; 
import { findAll, findByOwner, createParticipant, deleteParticipant, findById } from '../src/repositories/participants.js'; 
import { clearUsersCollection } from '../src/repositories/users.js';
let app;

beforeAll(async () => {
    await connectDB();
    //app = setupApp();
    //await User.deleteMany({});
    await clearUsersCollection(); 
});

//afterAll(async () => {
    //await disconnect();
//});
describe('POST /auth/signup', () => {
    test('should allow a new admin to signup', async () => {
        const response = await request(app)
            .post('/auth/signup')
            .send({
                email: 'admin_test@test.com',
                password: 'pass1234',
                role: 'admin'
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('email', 'admin_test@test.com');
        expect(response.body).toHaveProperty('role', 'admin');
        expect(response.body).not.toHaveProperty('password'); 
    });

    test('should allow a new student to signup', async () => {
        const response = await request(app)
            .post('/auth/signup')
            .send({
                email: 'student_test@test.com',
                password: 'pass4321',
                role: 'student'
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('email', 'student_test@test.com');
        expect(response.body).toHaveProperty('role', 'student');
    });

    test('should fail if user already exists', async () => {
        const response = await request(app)
            .post('/auth/signup')
            .send({
                email: 'admin_test@test.com', 
                password: 'pass1234',
                role: 'admin'
            });

        expect(response.statusCode).toBe(409); 
        expect(response.body).toHaveProperty('error', 'Email 已被註冊');
    });

    test('should fail if email is missing', async () => {
        const response = await request(app)
            .post('/auth/signup')
            .send({
                password: 'pass1234',
                role: 'admin'
            });

        expect(response.statusCode).toBe(400); 
        expect(response.body).toHaveProperty('error', 'Email/Password 必填');
    });
});