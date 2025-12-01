import { ObjectId } from 'mongodb';
import { getDB } from '../db.js';

const collection = () => getDB().collection('participants');

export async function ensureIndexes() {
  try {
    await collection().createIndex({ email: 1 }, { unique: true });
    console.log('[DB] Email index ensured');
  } catch (err) {
    console.error('[DB] Failed to create index', err);
  }
}

export async function createParticipant(data) {
  try {
    const result = await collection().insertOne({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return result.insertedId;
  } catch (error) {
    if (error.code === 11000) { 
      throw error; 
    }
    throw error;
  }
}

export function listParticipants(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  return collection()
    .find()
    .sort({ createdAt: -1 })
    .skip(skip) 
    .limit(limit) 
    .toArray();
}
export async function updateParticipant(id, patch) {
  return collection().updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...patch, updatedAt: new Date() } }
  );
}
export function deleteParticipant(id) {
  return collection().deleteOne({ _id: new ObjectId(id) });
}