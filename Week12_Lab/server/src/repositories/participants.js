import { getCollection } from '../db.js';
import { ObjectId } from 'mongodb'; 

// 🎯 1. 新增 findAll 函式 (查詢所有資料)
export async function findAll() {
    return getCollection('participants').find({}).toArray();
}

// 🎯 2. 新增 findByOwner 函式 (查詢單一擁有者的資料)
export async function findByOwner(ownerId) {
    return getCollection('participants').find({ ownerId }).toArray();
}

// 🎯 3. 新增 createParticipant 函式 (新增資料)
export async function createParticipant(participant) {
    const result = await getCollection('participants').insertOne(participant);
    return { ...participant, _id: result.insertedId };
}

// 🎯 4. 這是您提供的 deleteParticipant 函式 (確保它也在檔案中)
export async function deleteParticipant(id, userId, userRole) {
    const participantId = new ObjectId(id);
    //const ownerId = new ObjectId(userId);

    const participant = await getCollection('participants').findOne({ _id: participantId });

    if (!participant) {
        return null;
    }

    const isOwner = participant.ownerId.equals(ownerId);
    const isAdmin = userRole === 'admin'; 
    
    if (!isAdmin && !isOwner) {
        return { message: 'Forbidden' }; 
    }
    const result = await getCollection('participants').deleteOne({ _id: participantId });
    
    return result.deletedCount > 0 ? participant : null;
}