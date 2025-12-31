require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('連到資料庫了！'))
  .catch(err => console.log('連不上資料庫：', err));

app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);

app.listen(process.env.PORT, () => {
  console.log(`伺服器跑在 http://localhost:${process.env.PORT}`);
});