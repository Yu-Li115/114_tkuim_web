import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, 
    environment: 'node',

    server: {
      deps: {
        exclude: [
          'cors', 
          'supertest', 
          'mongodb',
          'jsonwebtoken',
          'bcrypt',
          'dotenv',
          'morgan',
        ]
      }
    }
  },
});