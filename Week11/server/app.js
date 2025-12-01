import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';
import signupRouter from './routes/signup.js';
import { ensureIndexes } from './repositories/participants.js'; 

const app = express();
app.use(cors({ origin: process.env.ALLOWED_ORIGIN }));
app.use(express.json());

app.use('/api/signup', signupRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  if (err.code === 11000) {
     return res.status(409).json({ error: '資料重複：該 Email 已被註冊' });
  }
  res.status(500).json({ error: 'Server Error' });
});
const port = process.env.PORT || 3001;
connectDB()
  .then(async () => { 
    await ensureIndexes(); 
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect MongoDB', error);
    process.exit(1);
  });