import { getCollection } from '../db.js';
export async function clearUsersCollection() {
    await getCollection('users').deleteMany({});
    await getCollection('refreshTokens').deleteMany({}); 
}

export async function findUserByEmail(email) {
    return getCollection('users').findOne({ email });
}

export async function findUserById(id) {
    return getCollection('users').findOne({ _id: id });
}

export async function createUser({ email, passwordHash, role = 'student' }) {
    const doc = { email, passwordHash, role, createdAt: new Date() };
    const result = await getCollection('users').insertOne(doc);
    return { ...doc, _id: result.insertedId };
}

export async function updateUserPassword(userId, passwordHash) {
    await getCollection('users').updateOne(
        { _id: userId },
        { $set: { passwordHash } }
    );
}
export async function storeRefreshToken(userId, token, expiresAt) {
    await getCollection('refreshTokens').insertOne({ userId, token, expiresAt });
}

export async function verifyRefreshToken(token) {
    return getCollection('refreshTokens').findOne({ token });
}

export async function deleteRefreshToken(token) {
    await getCollection('refreshTokens').deleteOne({ token });
}