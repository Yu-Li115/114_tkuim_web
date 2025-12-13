import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { connectDB } from '../src/db.js';
import app from '../src/app.js';
import { clearUsersCollection } from '../src/repositories/users.js'; 

let server;

beforeAll(async () => {
    await connectDB();
    await clearUsersCollection(); 
    server = app.listen(4000);
});

afterAll(() => {
    server.close();
});

describe('Auth API', () => {
    it('signup', async () => {
        const res = await request(server).post('/auth/signup').send({ email: 'test@example.com', password: '1234' });
        expect(res.status).toBe(201);
        expect(res.body.email).toBe('test@example.com');
    });

    it('login', async () => {
        const res = await request(server).post('/auth/login').send({ email: 'test@example.com', password: '1234' });
        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
    });
    
    it('signup_duplicate_fails', async () => {
        const res = await request(server).post('/auth/signup').send({ email: 'test@example.com', password: '1234' });
        expect(res.status).toBe(409);
    });
});