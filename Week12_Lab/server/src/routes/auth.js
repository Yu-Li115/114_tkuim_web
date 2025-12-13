import express from 'express';
import bcrypt from 'bcrypt';
import {
    findUserByEmail,
    createUser,
    storeRefreshToken,
    deleteRefreshToken,
    verifyRefreshToken,
    findUserById,
    updateUserPassword, 
} from '../repositories/users.js';
import { generateAccessToken, generateRefreshToken } from '../generateToken.js';
import { logAction } from '../../utils/logger.js'; 

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { email, password, role } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email/Password 必填' });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
        return res.status(409).json({ error: 'Email 已被註冊' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser({ 
        email, 
        passwordHash, 
        role: role || 'student' 
    });

    logAction(user._id, 'signup', { email: user.email, role: user.role }); 
    res.status(201).json({ _id: user._id, email: user.email, role: user.role });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email/Password 必填' });
    }

    const user = await findUserByEmail(email);

    if (!user) {
        return res.status(401).json({ error: '帳號或密碼錯誤' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
        return res.status(401).json({ error: '帳號或密碼錯誤' });
    }

    const token = generateAccessToken(user);
    const refreshToken = generateRefreshToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000); 
    await storeRefreshToken(user._id, refreshToken, expiresAt);

    logAction(user._id, 'login'); 
    res.json({ token, refreshToken, user: { _id: user._id, email: user.email, role: user.role } });
});


router.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token 必填' });
    }

    const record = await verifyRefreshToken(refreshToken);
    
    if (!record || record.expiresAt < new Date()) {
        if (record) await deleteRefreshToken(refreshToken);
        return res.status(401).json({ error: 'Refresh Token 無效或已過期' });
    }
    
    const user = await findUserById(record.userId);
    if (!user) {
        return res.status(404).json({ error: '使用者不存在' });
    }
    
    const newToken = generateToken(user);

    logAction(user._id, 'refresh_token'); 
    res.json({ token: newToken });
});


router.post('/logout', async (req, res) => {
    const { refreshToken } = req.body;
    if (refreshToken) {
        await deleteRefreshToken(refreshToken);
    }
    res.json({ message: '已登出' });
});

export default router;