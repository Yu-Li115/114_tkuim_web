import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { findUserByEmail, createUser } from '../repositories/users.js';
import { logAction } from '../../utils/logger.js';
import { ObjectId } from 'mongodb'; 

const router = express.Router();
router.use(authMiddleware); 

router.get('/', async (req, res) => {
  const data = req.user.role === 'admin'
    ? await findAll()
    : await findByOwner(new ObjectId(req.user.id)); 
  
  res.json({
    total: data.length,
    data
  });
});

router.post('/', async (req, res) => {
  const participant = { 
    ...req.body, 
    ownerId: new ObjectId(req.user.id), 
    createdAt: new Date() 
  };
  const saved = await createParticipant(participant);
  
  //logAction(req.user.id, 'create_participant', { participantId: saved._id });
  res.status(201).json(saved);
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id; 
  const allParticipants = req.user.role === 'admin'
    ? await findAll()
    : await findByOwner(new ObjectId(req.user.id)); 
  
  const target = allParticipants.find(p => p._id.toString() === id);

  if (!target) {
    return res.status(404).json({ error: '資料不存在或權限不足' });
  }

  await deleteParticipant(target._id); 
  
  //logAction(req.user.id, 'delete_participant', { participantId: id });
  res.json({ message: '刪除完成' });
});

export default router;