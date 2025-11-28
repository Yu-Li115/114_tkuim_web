import { Router } from 'express';
import { nanoid } from 'nanoid';
import fs from 'fs';
import { z } from 'zod';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'participants.json');

const router = Router();

function loadData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

const participants = loadData();

const signupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().regex(/^09\d{8}$/),
  password: z.string().min(8),
  confirmPassword: z.string(),
  interests: z.array(z.string()).min(1),
  terms: z.boolean()
}).refine(data => data.password === data.confirmPassword, {
  message: '密碼與確認密碼不一致',
  path: ['confirmPassword']
});

router.get('/', (req, res) => {
  res.json({ total: participants.length, data: participants });
});

router.get('/:id', (req, res) => {
  const p = participants.find(item => item.id === req.params.id);
  if (!p) return res.status(404).json({ error: '找不到這位參與者' });
  res.json(p);
});

router.post('/', (req, res) => {
  const parse = signupSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.errors[0].message });
  }
  const newParticipant = {
    id: nanoid(8),
    name: parse.data.name,
    email: parse.data.email,
    phone: parse.data.phone,
    interests: parse.data.interests,
    createdAt: new Date().toISOString()
  };
  participants.push(newParticipant);
  saveData(participants);
  res.status(201).json({ message: '報名成功', participant: newParticipant });
});

router.delete('/:id', (req, res) => {
  const index = participants.findIndex(item => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: '找不到這位參與者' });
  const [removed] = participants.splice(index, 1);
  saveData(participants);
  res.json({ message: '已取消報名', participant: removed });
});

export { router };
