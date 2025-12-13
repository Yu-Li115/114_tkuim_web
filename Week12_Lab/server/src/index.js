import app from './app.js';
import { connectDB } from './db.js';

const PORT = process.env.PORT || 3001;
const FALLBACK_SECRET = 'your_default_jwt_secret'; 

async function startServer() {
  try {
    const JWT_SECRET_CHECK = process.env.JWT_SECRET || FALLBACK_SECRET;
    console.log('----------------------------------------------------');
    console.log(`[檢查] 您的 JWT Secret Key 載入值為: ${JWT_SECRET_CHECK}`);
    console.log(`[重要] 請確保此值與 generateToken.js 和 authMiddleware.js 內定義的密鑰完全一致！`);
    console.log('----------------------------------------------------');

    await connectDB();
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
       console.log(`Server 已啟動，http://localhost:${PORT}`);
    });

   } catch (err) {
      console.error('伺服器啟動失敗', err);
      process.exit(1);
    }
}
startServer();