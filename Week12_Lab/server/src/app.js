import express from 'express';
import { authMiddleware } from './middleware/auth.js'; 
import { logActionMiddleware } from './middleware/log.js';
import authRoutes from './routes/auth.js';
import signupRoutes from './routes/signup.js';
import participantsRouter from './routes/participants.js'; 

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const cors = require('cors'); 
const morgan = require('morgan'); 

const app = express();
app.use(cors()); 
app.use(express.json());
app.use(morgan('dev')); 
app.use(logActionMiddleware); 

app.use('/auth', authRoutes);
//app.use('/api/signup', authMiddleware, signupRoutes);
app.use('/api/participants', participantsRouter); 

app.use((req, res) => {
    res.status(404).json({ error: 'API 不存在' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: '伺服器錯誤' });
});

export default app;