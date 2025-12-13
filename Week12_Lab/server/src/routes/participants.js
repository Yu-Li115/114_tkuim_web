import express, { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js'; 
import { findAll, findByOwner, createParticipant, deleteParticipant } from '../repositories/participants.js';
import { logAction } from '../../utils/logger.js'; 
import { ObjectId } from 'mongodb'; 

const router = Router();
router.use(authMiddleware); 

router.get('/', authMiddleware, async (req, res) => {
  const data = req.user.role === 'admin'
    ? await findAll()
    : await findByOwner(new ObjectId(req.user.id)); 
  
  res.json({
    total: data.length,
    data
  });
});

router.post('/', authMiddleware, async (req, res) => {
  const participant = { 
    ...req.body, 
    ownerId: new ObjectId(req.user.id), 
    createdAt: new Date() 
  };
  const saved = await createParticipant(participant);
  
  //logAction(req.user.id, 'create_participant', { participantId: saved._id });
  res.status(201).json(saved);
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;
        
        if (!id || id.length !== 24) { 
            return res.status(400).json({ error: '無效的 ID 格式' });
        }
        const participant = await deleteParticipant(id, userId, userRole);

        if (!participant) {
            return res.status(404).json({ error: '找不到該參與者' });
        }
        if (participant.message === 'Forbidden') {
             return res.status(403).json({ error: '權限不足，無法刪除此資料' });
        }

        return res.status(204).send(); 
    } catch (error) {
        console.error('Error deleting participant:', error);
        return res.status(500).json({ error: '伺服器內部錯誤' });
    }
});

export default router;