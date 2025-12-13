import jwt from 'jsonwebtoken';

const JWT_SECRET = 'TKU_IM_WEB_FINAL_SECRET_2025'; 

export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: '缺少授權資訊' });
    }
    const token = authHeader.replace('Bearer ', '');
    try {
        const payload = jwt.verify(token, JWT_SECRET); 
        req.user = { 
            id: payload.userId, 
            email: payload.email, 
            role: payload.role 
        };
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token 無效或已過期' });
    }
}