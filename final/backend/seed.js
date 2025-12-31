require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
  { name: '拿鐵咖啡', price: 120, category: 'Coffee', stock: 20 },
  { name: '美式咖啡', price: 90, category: 'Coffee', stock: 50 },
  { name: '卡布奇諾', price: 130, category: 'Coffee', stock: 15 },
  { name: '宇治抹茶歐蕾', price: 140, category: 'Tea', stock: 10 },
  { name: '法式提拉米蘇', price: 150, category: 'Dessert', stock: 5 }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('資料初始化成功');
    process.exit();
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });