import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid'; 
const JWT_SECRET = 'TKU_IM_WEB_FINAL_SECRET_2025'; 
const TOKEN_EXPIRY = '1h'; 

export function generateAccessToken(user) {
    const payload = {
        userId: user._id, 
        email: user.email,
        role: user.role
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
    return token;
}
export function generateRefreshToken() {
    return uuidv4();
}