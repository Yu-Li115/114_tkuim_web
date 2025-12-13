import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
// dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/week12'; 
const client = new MongoClient(MONGO_URI);
let db;

export async function connectDB() {
    await client.connect();
    db = client.db();
    console.log('Connected to MongoDB'); 
}

export function getCollection(name) {
    return db.collection(name);
}