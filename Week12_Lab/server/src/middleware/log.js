import { logAction } from '../../utils/logger.js'; 

export const logActionMiddleware = (req, res, next) => {
    req.logAction = logAction; 
    next();
};